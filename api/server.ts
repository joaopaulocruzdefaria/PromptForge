import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// 1. Configuração de Ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Em produção, configure a origin: 'http://seusite.com'

// Interfaces
interface AnalysisRequestBody {
  prompt: string;
}

app.post("/api/analyze", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body; // Remova a tipagem forçada aqui se der erro, deixe inferir

    if (!prompt) {
      res.status(400).json({ error: "O prompt é obrigatório." });
      return;
    }

    const userApiKey = req.headers["x-api-key"] as string;
    const userModel = (req.headers["x-model"] as string) || "gpt-4-turbo";
    
    const openai = new OpenAI({
      apiKey: userApiKey,
    });

    if (!userApiKey) {
      res.status(401).json({ 
        error: "MISSING_API_KEY",
        message: "⚠️ Configure sua chave de API para continuar." 
      });
      return;
    }

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
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0].message.content;
    const jsonResult = JSON.parse(content || "{}");

    res.json(jsonResult);
  } catch (error: any) {
    console.error("Erro na análise:", error);
    res.status(500).json({ error: "Falha ao processar a análise." });
  }
});

app.post("/api/optimize", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "O prompt é obrigatório." });
      return;
    }
    
    const userApiKey = req.headers["x-api-key"] as string;
    const userModel = (req.headers["x-model"] as string) || "gpt-4-turbo";
    
    const openai = new OpenAI({
      apiKey: userApiKey,
    });

    if (!userApiKey) {
      res.status(401).json({ 
        error: "MISSING_API_KEY",
        message: "⚠️ Configure sua chave de API para continuar." 
      });
      return;
    }

    const SYSTEM_PROMPT = `
      Você é um assistente especialista em refatoração de prompts.
      SEU OBJETIVO: Reescrever o prompt do usuário para torná-lo mais claro, específico e estruturado, mantendo a intenção original.

      REGRAS:
      1. Não adicione explicações, introduções ou conversas.
      2. Retorne APENAS o conteúdo do novo prompt.
      3. Mantenha estritamente as variáveis ou placeholders (ex: {{nome}}).
      4. Use Markdown para negrito e listas, mas NÃO use blocos de código (\`\`\`) para envolver a resposta inteira.
      5. Mantenha o idioma original do prompt do usuário.
    `;

    const completion = await openai.chat.completions.create({
      model: userModel, // Ou gpt-4-turbo, ou o modelo que preferir
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Temperatura mais baixa para ser mais assertivo
    });

    const optimizedPrompt = completion.choices[0].message.content;

    res.json({ optimizedPrompt });
  } catch (error: any) {
    console.error("Erro na otimização:", error);
    res.status(500).json({ error: "Falha ao otimizar o prompt." });
  }
});

// Inicialização
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🤖 Modo OpenAI ativado.`);
});
