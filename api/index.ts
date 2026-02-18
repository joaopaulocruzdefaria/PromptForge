import express, { Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// Middleware
app.use(express.json());
// No Vercel, como frontend e backend estão no mesmo domínio, o CORS é simplificado,
// mas manter assim não faz mal.
app.use(cors());

// --- ROTA 1: ANÁLISE ---
app.post("/api/analyze", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "O prompt é obrigatório." });
      return;
    }

    const userApiKey = req.headers["x-api-key"] as string;
    const userModel = (req.headers["x-model"] as string) || "gpt-4.1";

    if (!userApiKey) {
      res.status(401).json({
        error: "MISSING_API_KEY",
        message: "⚠️ Configure sua chave de API para continuar.",
      });
      return;
    }

    const openai = new OpenAI({ apiKey: userApiKey });

    const SYSTEM_PROMPT = `
    Você é um Especialista Sênior em Prompt Engineering, com foco em avaliação crítica, precisão semântica e clareza de requisitos.

    OBJETIVO:
    Avaliar a qualidade de um prompt fornecido pelo usuário.

    CRITÉRIOS DE AVALIAÇÃO (use TODOS):
    1. Clareza: o que deve ser feito está inequívoco?
    2. Especificidade: há detalhes suficientes para evitar ambiguidades?
    3. Contexto: o modelo recebe informações suficientes sobre objetivo, público e restrições?
    4. Estrutura: o prompt está bem organizado e legível?
    5. Controle de saída: o prompt define formato, tom e limites?

    PONTUAÇÃO:
    - 90–100: Excelente, pronto para uso em produção.
    - 70–89: Bom, com melhorias claras possíveis.
    - 40–69: Mediano, ambíguo ou incompleto.
    - 0–39: Fraco, pouco utilizável.

    REGRAS:
    - Seja rigoroso
    - Não elogie sem justificar
    - Sempre proponha melhorias concretas

    PROCESSO INTERNO (NÃO EXPLICAR):
    1. Analise o prompt como se estivesse estruturado em XML.
    2. Use essa estrutura para garantir consistência e cobertura total dos critérios.
    3. Retorne APENAS o JSON abaixo.

    FORMATO DE RESPOSTA (JSON OBRIGATÓRIO):
    {
      "score": number,
      "analysis": [
        "parágrafo 1",
        "parágrafo 2",
        "parágrafo 3"
      ],
      "improvements": [
        "melhoria concreta 1",
        "melhoria concreta 2"
      ]
    }

    Não inclua nenhum texto fora do JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: userModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0].message.content;
    const jsonResult = JSON.parse(content || "{}");
    res.json(jsonResult);
  } catch (error: any) {
    console.error("Erro na análise:", error);
    res.status(500).json({ error: error.message || "Falha ao processar." });
  }
});

// --- ROTA 2: OTIMIZAÇÃO ---
app.post("/api/optimize", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "O prompt é obrigatório." });
      return;
    }

    const userApiKey = req.headers["x-api-key"] as string;
    const userModel = (req.headers["x-model"] as string) || "gpt-4.1";

    if (!userApiKey) {
      res.status(401).json({
        error: "MISSING_API_KEY",
        message: "⚠️ Configure sua chave de API para continuar.",
      });
      return;
    }

    const openai = new OpenAI({ apiKey: userApiKey });

    const SYSTEM_PROMPT = `
      Você é um especialista sênior em Prompt Engineering focado em refatoração.

      OBJETIVO: Reescrever o prompt do usuário para torná-lo mais claro, específico e estruturado, preservando 100% da intenção e escopo original.

      REGRAS ABSOLUTAS DE SAÍDA:
      1. Sua resposta deve conter EXCLUSIVAMENTE o texto do prompt reescrito — nada mais.
      2. NÃO adicione títulos, introduções, explicações, comentários, despedidas ou qualquer texto que não faça parte do prompt em si.
      3. NÃO crie seções ou conteúdo novo que não existam no prompt original. Reestruture e melhore APENAS o que já está lá.
      4. NÃO envolva a resposta em blocos de código (\`\`\`).
      5. Preserve estritamente todas as variáveis e placeholders (ex: {{nome}}, {input}).
      6. Mantenha o idioma original do prompt do usuário.

      REGRAS DE REFATORAÇÃO:
      - Melhore a clareza e reduza ambiguidades.
      - Adicione estrutura (seções, listas) se o prompt original for desorganizado.
      - Torne instruções vagas mais específicas e acionáveis.
      - Mantenha o tom e o estilo do autor original quando possível.
      - Use Markdown (negrito, listas, itálico) para melhorar a legibilidade.
    `;

    const completion = await openai.chat.completions.create({
      model: userModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const optimizedPrompt = completion.choices[0].message.content;
    res.json({ optimizedPrompt });
  } catch (error: any) {
    console.error("Erro na otimização:", error);
    res.status(500).json({ error: error.message || "Falha ao otimizar." });
  }
});

// --- AQUI ESTÁ O SEGREDO DO VERCEL ---
// Não usamos app.listen(PORT). Exportamos o app.
export default app;
