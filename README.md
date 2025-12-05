<div align="center">
  <img src="assets/Banner_LocalMind.png" alt="LocalMind Banner" width="900"/>
  <br/><br/>
  <h1><b>LocalMind — AI Without Limits</b></h1>
  <p>
    A free, open-source AI platform that lets you run local LLMs, connect cloud AI providers, teach your AI with your own data, and share your AI instance globally — all with full privacy and unlimited usage.
  </p>
  <br/>

  <!-- Badges -->
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"/>
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React"/>
  </a>
</div>

---

## 📖 Table of Contents

- [🔥 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation Guide](#-installation-guide)
- [⚙️ Environment Variables](#-environment-variables)
- [📁 Folder Structure](#-folder-structure)
- [🧩 API Documentation](#-api-documentation)
- [🚀 Usage Workflow](#-usage-workflow)
- [🤝 Contributing](#-contributing)
- [🪪 License](#-license)
- [👤 Author](#-author)

---

## 🔥 Overview

**LocalMind** is a free, open-source, self-hosted AI platform built for **students, developers, researchers, and creators** who want powerful AI capabilities without subscriptions, limits, or privacy concerns.

With LocalMind, you can:

- Run **local LLMs** like LLaMA, Mistral, Phi, Gemma — 100% free & offline  
- Connect **cloud AI models** like Gemini, OpenAI, Groq, RouterAI  
- Train your AI with **Excel/CSV files or Q&A datasets**  
- Expose your local AI to the world via **LocalTunnel or Ngrok**  
- Build apps using a **developer-friendly API layer**  
- Test multiple models using an integrated **AI playground**  

LocalMind gives you **freedom, privacy, flexibility, and unlimited usage** — all for free.

---

## ✨ Features

### 🧠 AI Model Support

Supports both **local** and **cloud** AI engines:

#### Local Models (via Ollama)
- LLaMA  
- Mistral  
- Phi  
- Gemma  
- Any Ollama-compatible model

#### Cloud Models
- Google Gemini  
- OpenAI GPT  
- Groq  
- RouterAI  
- _(More coming soon!)_

---

### 📚 Train with Your Own Data (RAG)

Teach your AI with your own files:

- Upload **Excel (.xlsx / .csv)**  
- Upload **Q&A datasets**  
- Automatically builds a private **vector database**  
- Fully local, no uploads, no cloud storage

Perfect for students, researchers, startups, and internal tools.

---

### 🌐 Share Your AI Globally

Expose your local instance so anyone on the internet can use your AI:

- LocalTunnel  
- Ngrok  

Great for demos, clients, teammates, or beta testing.

---

### 🤖 Single or Multiple Models

You can run:

- One model at a time, OR  
- Multiple models (local + cloud) simultaneously  

LocalMind handles routing internally.

---

### 🔒 Privacy & Security

Your data is yours — always.

- API keys stay **on your device**
- No analytics or tracking  
- Fully open-source  
- No external storage  
- No vendor lock-in

---

## 🛠️ Tech Stack

| Layer        | Technology                   |
| ------------ | ---------------------------- |
| **Frontend** | React, TypeScript, Vite      |
| **Backend**  | Node.js, Express, TypeScript |
| **AI Layer** | Ollama + Cloud Providers     |

---

## 📦 Installation Guide

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/LocalMind.git
cd LocalMind
```

---

### 2. ⚙️ Backend Setup

```bash
cd server
npm install
npm run dev   # http://localhost:3000
```

---

### 3. 🎨 Frontend Setup

```bash
cd ../client
npm install
npm run dev   # http://localhost:5173
```

---

## ⚙️ Environment Variables

Create `.env` inside **server**:

| Variable           | Description                                   |
| ------------------ | --------------------------------------------- |
| `API_KEY`          | Your cloud AI key (Gemini/OpenAI/etc.)        |
| `ENVIRONMENT`      | development / production                      |
| `LOCALMIND_SECRET` | JWT/API generator secret                      |

> ⚠️ Do NOT commit `.env` files to GitHub.

---

## 📁 Folder Structure

```
LocalMind/
│
├── assets/
│   └── Banner_LocalMind.png
│
├── LocalMind-Backend/
│   ├── src/
│   │   └── ... (backend source code)
│   │
│   ├── types/
│   │   └── ... (TypeScript types)
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── a.md
│   ├── jest.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── setup-cloudflare.sh
│   ├── tsconfig.json
│
├── LocalMind-Frontend/
│   ├── public/
│   │   └── ... (static assets)
│   │
│   ├── src/
│   │   └── ... (React code)
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│
├── Contributing.md
├── LICENSE
└── README.md

```

---

## 🧩 API Documentation

### 🔐 Auth

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| POST   | `/api/v1/user/register` | Register user      |
| POST   | `/api/v1/user/login`    | Login              |
| GET    | `/api/v1/user/profile`  | User profile       |

---

### ⚙️ AI Config & Keys

| Method | Endpoint                                    | Description           |
| ------ | ------------------------------------------- | --------------------- |
| POST   | `/api/v1/user/local-mind-api-key-generator` | Generate API key      |
| GET    | `/api/v1/user/local-mind-api-keys`          | Fetch keys            |
| GET    | `/api/v1/user/ai-config`                    | Get AI configuration  |

---

### 💬 Chat & Messages

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/v1/chat/send-message` | Send message to AI      |
| GET    | `/api/v1/chat/history`      | Get chat history        |

---

### 📚 Upload & Training

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/api/v1/upload/excel`   | Upload Excel/CSV     |
| POST   | `/api/v1/upload/dataSet` | Upload Q&A dataset   |
| POST   | `/api/v1/train/upload`   | Upload training data |

---

### 🌐 Port Exposure

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| POST   | `/api/v1/expose/localtunnel` | Public URL via LT    |
| POST   | `/api/v1/expose/ngrok`       | Public URL via Ngrok |

---

## 🚀 Usage Workflow

1. Start backend & frontend  
2. Register or Login  
3. Connect cloud AI or select local model  
4. Upload files (optional)  
5. Chat with AI  
6. Expose AI globally (optional)  

---

## 🤝 Contributing

We welcome all contributions!

```
Fork → Create Branch → Commit → Push → Pull Request
```

Use meaningful commit messages & follow TypeScript conventions.

---

## 🪪 License

Licensed under the **MIT License**.

---

## 👤 Author

**NexGenStudioDev**

> 🚀 *LocalMind — Free, Private, Limitless AI for Everyone.*

