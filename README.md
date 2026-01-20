# PromptForge 🤖✨

Uma ferramenta SaaS interna para auditar e otimizar prompts de IA, garantindo que eles sigam a cultura, o tom de voz e as regras de compliance da sua empresa.

![Project Status](https://img.shields.io/badge/status-development-orange)

## 📋 Funcionalidades

- **Auditor de Prompts:** Analisa um prompt e retorna uma lista de críticas construtivas baseadas nas regras da empresa.
- **Otimizador de Prompts:** Reescreve automaticamente o prompt utilizando técnicas de _Prompt Engineering_ (Chain of Thought, Few-Shot) para obter melhores resultados.
- **Contexto Configurável:** Permite definir regras dinâmicas (ex: "Tom formal", "Evitar voz passiva") que guiam a IA.
- **Interface Moderna:** Dashboard Dark Mode construído com Tailwind CSS.

## 🛠 Stack Tecnológica

- **Frontend:** Vue.js 3 (Composition API) + Vite
- **Estilização:** Tailwind CSS + Lucide Icons
- **Backend:** Node.js + Express (TypeScript)
- **AI Engine:** OpenAI API + Gemini

---

## 🚀 Como Configurar o Projeto

### 1. Pré-requisitos

- Node.js instalado (v18 ou superior).
- Uma chave de API da OpenAI ([Obter aqui](https://platform.openai.com/api-keys)).

### 2. Instalação

Abra o terminal na pasta raiz do projeto e instale todas as dependências (Front e Back):

```bash
npm install

```

### 3. Configuração de Ambiente (.env)

Crie um arquivo chamado `.env` na **raiz** do projeto (ao lado do `package.json`) e configure suas variáveis:

```ini
# Porta do servidor Backend
PORT=3000

# Sua chave da OpenAI
OPENAI_API_KEY=sk-proj-SUA-CHAVE-AQUI

```

---

## ⚡ Como Rodar (Desenvolvimento)

Como o projeto utiliza uma arquitetura unificada (Monolito), você precisará de **dois terminais** abertos simultaneamente na raiz do projeto:

### Terminal 1: Backend (API)

Este comando sobe o servidor Express na porta 3000:

```bash
npx tsx server.ts

```

_Aguarde a mensagem: `🚀 Backend (TS) rodando na porta 3000_`

### Terminal 2: Frontend (Vue + Vite)

Este comando sobe a interface visual:

```bash
npm run dev

```

_Acesse o projeto no navegador em:_ `http://localhost:5173`

---

## 📂 Estrutura de Pastas

```text
/
├── .env                # Variáveis de ambiente (NÃO COMITAR)
├── server.ts           # Código do servidor Backend (API)
├── vite.config.ts      # Configuração do Proxy (Redireciona /api -> localhost:3000)
├── package.json        # Dependências do projeto
└── src/
    ├── App.vue         # Componente principal da aplicação
    └── main.ts         # Ponto de entrada do Vue

```

---

## 🐛 Solução de Problemas Comuns

- **Erro 500 ao clicar nos botões:** Verifique se o arquivo `.env` foi criado corretamente e se a chave da API é válida (e tem saldo).
- **Erro de conexão (Network Error):** Certifique-se de que o **Terminal 1** (`server.ts`) ainda está rodando. O Frontend precisa dele ligado para funcionar.
