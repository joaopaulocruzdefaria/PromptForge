import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Tipagem básica para garantir segurança no código
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interface para o corpo da requisição
interface OptimizationBody {
  prompt: string;
  context?: string;
}

// --- ROTA 1: AUDITOR (Analisa e critica) ---
app.post("/api/analyze", async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body as OptimizationBody;

    if (!prompt) {
      res.status(400).json({ error: "O prompt é obrigatório." });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use gpt-4o se tiver acesso e quiser mais inteligência
      messages: [
        {
          role: "system",
          content: `Você é um Auditor de Prompts Sênior. 
                    Objetivo: Analisar o prompt do usuário com base nas Regras da Empresa.
                    Regras da Empresa: "${context || "Padrão: Seja claro, objetivo e profissional."}"
                    
                    Saída esperada: Retorne APENAS um objeto JSON com uma chave "analysis" contendo uma lista de strings (3 a 5 pontos de melhoria).
                    Exemplo: { "analysis": ["O tom está informal.", "Falta formato de saída."] }`,
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    // Parse seguro
    const jsonContent = JSON.parse(content || '{ "analysis": [] }');
    res.json(jsonContent);
  } catch (error) {
    console.error("Erro no Auditor:", error);
    res.status(500).json({ error: "Falha ao analisar o prompt." });
  }
});

// --- ROTA 2: OTIMIZADOR (Reescreve) ---
app.post("/api/optimize", async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body as OptimizationBody;

    if (!prompt) {
      res.status(400).json({ error: "O prompt é obrigatório." });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um Especialista em Prompt Engineering.
                    Regras da Empresa: "${context || "Profissional e direto."}"
                    Tarefa: Reescreva o prompt do usuário aplicando técnicas de Chain of Thought e Few-Shot.
                    Saída: Apenas o texto do novo prompt.`,
        },
        { role: "user", content: prompt },
      ],
    });

    res.json({ optimizedPrompt: completion.choices[0].message.content });
  } catch (error) {
    console.error("Erro no Otimizador:", error);
    res.status(500).json({ error: "Falha ao otimizar o prompt." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend (TS) rodando na porta ${PORT}`);
});
