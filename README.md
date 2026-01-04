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
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express"/>
  </a>
  
  <br/><br/>
  
  <p>
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-features">Features</a> •
    <a href="#-installation-guide">Installation</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## 📖 Table of Contents

- [🔥 Overview](#-overview)
- [📸 Screenshots](#-screenshots)
- [✨ Features](#-features)
  - [🧠 AI Model Support](#-ai-model-support)
  - [📚 RAG: Train with Your Own Data](#-rag-train-with-your-own-data)
  - [🌐 Global AI Sharing](#-global-ai-sharing)
  - [🔒 Privacy & Security](#-privacy--security)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation Guide](#-installation-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Running with Docker](#3-docker-optional)
- [⚙️ Configuration](#️-configuration)
- [📁 Project Structure](#-project-structure)
- [🧩 API Documentation](#-api-documentation)
- [💡 Usage Examples](#-usage-examples)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔧 Troubleshooting](#-troubleshooting)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [👤 Author](#-author)

---

## 🔥 Overview

**LocalMind** is a free, open-source, self-hosted AI platform designed for **students, developers, researchers, and creators** who demand powerful AI capabilities without the constraints of subscriptions, usage limits, or privacy compromises.

### Why LocalMind?

**Traditional AI platforms lock you in with:**

- 💸 Monthly subscription fees
- 🚫 Message and usage limits
- 🔍 Privacy concerns with data collection
- ☁️ Dependency on cloud services
- 🔒 Vendor lock-in

**LocalMind sets you free with:**

- ✅ **100% Free & Open Source** — No hidden costs, ever
- ✅ **Unlimited Usage** — No message caps or rate limits
- ✅ **Full Privacy** — Your data never leaves your machine
- ✅ **Hybrid Architecture** — Mix local and cloud models seamlessly
- ✅ **Custom Training** — Teach AI with your own datasets
- ✅ **Global Sharing** — Expose your AI to the world instantly
- ✅ **Developer-Friendly** — RESTful API for easy integration

### Perfect For

- 🎓 **Students** learning AI and machine learning
- 👨‍💻 **Developers** building AI-powered applications
- 🔬 **Researchers** conducting experiments with LLMs
- 🚀 **Startups** needing custom AI solutions without enterprise costs
- 🏢 **Organizations** requiring private AI infrastructure
- 🎨 **Creators** experimenting with AI-assisted content generation

---

## 📸 Screenshots

### Chat Interface

<div align="center">
  <img src="assets/screenshots/chat-interface.png" alt="LocalMind Chat Interface" width="800"/>
  <p><em>Clean, intuitive chat interface with multi-model support</em></p>
</div>

### Model Selection

<div align="center">
  <img src="assets/screenshots/model-selection.png" alt="AI Model Selection" width="800"/>
  <p><em>Easily switch between local and cloud AI models</em></p>
</div>

### RAG Dataset Upload

<div align="center">
  <img src="assets/screenshots/rag-upload.png" alt="RAG Dataset Upload" width="800"/>
  <p><em>Upload and process your own data for custom AI training</em></p>
</div>

### Dashboard

<div align="center">
  <img src="assets/screenshots/dashboard.png" alt="User Dashboard" width="800"/>
  <p><em>Monitor usage, manage models, and configure settings</em></p>
</div>

### Real-Time Streaming

<div align="center">
  <img src="assets/screenshots/streaming-response.png" alt="Streaming Responses" width="800"/>
  <p><em>Watch AI responses stream in real-time for better UX</em></p>
</div>

> **Note:** Screenshots showcase the latest version. Your interface may vary depending on customization and theme settings.

---

## ✨ Features

### 🧠 AI Model Support

LocalMind provides a unified interface to interact with both **local** and **cloud-based** AI models:

#### 🖥️ Local Models (via Ollama)

Run powerful open-source models completely offline:

| Model Family      | Description                 | Use Cases                       |
| ----------------- | --------------------------- | ------------------------------- |
| **LLaMA**         | Meta's flagship open model  | General chat, reasoning, coding |
| **Mistral**       | High-performance 7B model   | Fast responses, efficiency      |
| **Phi**           | Microsoft's compact model   | Edge devices, quick tasks       |
| **Gemma**         | Google's open model         | Balanced performance            |
| **Custom Models** | Any Ollama-compatible model | Specialized tasks               |

#### ☁️ Cloud Models

Integrate premium AI services when needed:

- **Google Gemini** — Advanced reasoning and multimodal
- **OpenAI GPT** — Industry-leading language models
- **Groq** — Ultra-fast inference speeds
- **RouterAI** — Intelligent model routing
- **Coming Soon:** Anthropic Claude, Cohere, AI21 Labs

**Switch between models instantly** — No code changes required!

---

### 📚 RAG: Train with Your Own Data

Transform LocalMind into your personal AI expert using **Retrieval-Augmented Generation (RAG)**:

#### Supported Formats

- 📊 **Excel Files** (.xlsx, .xls) — Import spreadsheets directly
- 📄 **CSV Files** — Parse comma-separated datasets
- ❓ **Q&A Datasets** — Upload question-answer pairs for fine-tuning
- 🔜 **Coming Soon:** PDF, TXT, JSON, and more

#### How It Works

1. **Upload** your documents through the UI
2. **Processing** — Automatic text extraction and chunking
3. **Vectorization** — Converts data to embeddings
4. **Storage** — Creates a private vector database
5. **Querying** — AI retrieves relevant context for responses

#### Use Cases

- 📖 Build a chatbot trained on your company's documentation
- 🎓 Create a study assistant with your course materials
- 🔬 Analyze research papers and datasets
- 💼 Build internal knowledge bases
- 📊 Query business data using natural language

**Your data stays 100% local** — No cloud uploads, no external storage.

---

### 🌐 Global AI Sharing

Share your LocalMind instance with anyone, anywhere:

#### Exposure Methods

| Method          | Speed | Custom Domain | Security |
| --------------- | ----- | ------------- | -------- |
| **LocalTunnel** | Fast  | ✅            | Basic    |
| **Ngrok**       | Fast  | ✅ Pro        | Advanced |

#### Benefits

- 🌍 **Instant Deployment** — No server setup required
- 🔗 **Shareable URLs** — Send links to teammates or clients
- 🚀 **Perfect for Demos** — Showcase your AI projects
- 👥 **Collaborative Testing** — Get feedback from users
- 📱 **Access Anywhere** — Use your AI from any device

#### Security Features

- 🔐 API key authentication
- 🚦 Rate limiting
- 🔒 HTTPS encryption
- 📊 Usage monitoring

---

### 🔒 Privacy & Security

Your data is yours — always.

#### Privacy Guarantees

- 🏠 **Local Processing** — RAG data never leaves your machine
- 🔑 **Encrypted Storage** — API keys stored securely
- 🚫 **No Telemetry** — Zero analytics or tracking
- 👁️ **Open Source** — Audit every line of code
- 🔓 **No Vendor Lock-In** — Export data anytime

#### Security Features

- 🛡️ JWT-based authentication
- 🔐 Bcrypt password hashing
- 🔒 CORS protection
- 🚦 Rate limiting
- 📝 Request validation
- 🔍 SQL injection prevention

---

## 🚀 Quick Start

Get LocalMind running in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/NexGenStudioDev/LocalMind.git
cd LocalMind

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start the backend
cd server && npm run dev

# Start the frontend (in a new terminal)
cd client && npm run dev

# Open http://localhost:5173
```

**That's it!** You're ready to chat with AI. 🎉

For detailed setup instructions, see the [Installation Guide](#-installation-guide) below.

---

## 📦 Installation Guide

### Prerequisites

Ensure you have the following installed:

| Software              | Version        | Download                            |
| --------------------- | -------------- | ----------------------------------- |
| **Node.js**           | 18.x or higher | [nodejs.org](https://nodejs.org/)   |
| **npm**               | 9.x or higher  | Included with Node.js               |
| **Git**               | Latest         | [git-scm.com](https://git-scm.com/) |
| **Ollama** (optional) | Latest         | [ollama.ai](https://ollama.ai/)     |

#### Verify Installation

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
git --version   # Should show git version 2.x.x
```

---

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your preferred editor
nano .env

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3000`

#### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run production build
npm run lint         # Check code quality with ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Check TypeScript types without building
npm run test         # Run test suite
```

---

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality with ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Check TypeScript types without building
```

---

### 3. Docker (Recommended for Production)

Run LocalMind with Docker for simplified deployment and consistent environments.

#### Prerequisites

- **Docker** (v20.10 or higher) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0 or higher) - Usually included with Docker Desktop

Verify installation:

```bash
docker --version
docker compose version
```

#### Quick Start with Docker Compose

1. **Configure environment variables:**

   ```bash
   cp env.example .env
   # Edit .env with your preferred editor
   nano .env
   ```

   **Required variables:**

   - `LOCALMIND_SECRET` - Generate with: `openssl rand -base64 32`
   - `JWT_SECRET` - Same as LOCALMIND_SECRET or generate separately
   - `Your_Name`, `YOUR_EMAIL`, `YOUR_PASSWORD` - Admin credentials
   - `DB_CONNECTION_STRING` - MongoDB connection string
   - API keys for cloud providers (optional)

2. **Build and start the application:**

   ```bash
   # Build and run (combined backend + frontend)
   docker compose up -d

   # View logs
   docker compose logs -f localmind

   # Check container status
   docker compose ps
   ```

3. **Access the application:**
   - Frontend & API: http://localhost:3000
   - API endpoints: http://localhost:3000/api/v1

#### Using Separate Services (Advanced)

For independent scaling of backend and frontend:

```bash
# Use separate services configuration
docker compose -f docker-compose.separate.yml up -d

# Access:
# - Frontend: http://localhost:80
# - Backend API: http://localhost:3000
```

#### Docker Commands Reference

```bash
# Build the image
docker build -t localmind:latest .

# Run container manually
docker run -d \
  --name localmind-app \
  -p 3000:3000 \
  --env-file .env \
  -v localmind-uploads:/app/uploads \
  -v localmind-data:/app/data \
  localmind:latest

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build

# View logs
docker compose logs -f

# Execute commands in container
docker compose exec localmind sh
```

#### Docker Features

- ✅ **Multi-stage builds** - Optimized image size (~300MB)
- ✅ **Non-root user** - Enhanced security
- ✅ **Health checks** - Automatic container monitoring
- ✅ **Volume persistence** - Data survives container restarts
- ✅ **Environment variables** - Easy configuration
- ✅ **Resource limits** - Prevent resource exhaustion

#### Troubleshooting Docker

**Container won't start:**

```bash
# Check logs
docker compose logs localmind

# Verify environment variables
docker compose exec localmind env
```

**Port already in use:**

```bash
# Change port in docker-compose.yml
ports:
  - '8080:3000'  # Access via localhost:8080
```

**Permission errors:**

```bash
# Fix volume permissions
docker compose exec localmind chown -R localmind:localmind /app/uploads /app/data
```

For more Docker details, see the [Docker Deployment Guide](#-docker-deployment-guide) section below.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/localmind
MONGO_URI=mongodb://localhost:27017/localmind

# Authentication
LOCALMIND_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=7d
REFRESH_TOKEN_EXPIRATION=30d

# AI Configuration
DEFAULT_MODEL=gemini-pro
OLLAMA_HOST=http://localhost:11434

# Cloud AI Provider Keys
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
GROQ_API_KEY=your-groq-api-key-here
ROUTERAI_API_KEY=your-routerai-api-key-here

# RAG Configuration
VECTOR_DB_PATH=./data/vectordb
MAX_FILE_SIZE=50MB
SUPPORTED_FORMATS=.xlsx,.csv,.xls

# Tunnel Configuration
LOCALTUNNEL_SUBDOMAIN=my-localmind
NGROK_AUTHTOKEN=your-ngrok-token-here

# Security
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

> ⚠️ **Security Warning:** Never commit `.env` files to version control. Add `.env` to your `.gitignore`.

### Frontend Configuration

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=LocalMind
VITE_ENABLE_ANALYTICS=false
```

---

## 🔧 Code Quality & Linting

LocalMind uses **ESLint** and **Prettier** to maintain consistent code style and catch errors early.

### Setup

1. **Install dependencies** (if not already installed):

   ```bash
   # Root directory
   pnpm install

   # Backend
   cd LocalMind-Backend && pnpm install

   # Frontend
   cd LocalMind-Frontend && pnpm install
   ```

2. **Install Husky** (for pre-commit hooks):
   ```bash
   # From root directory
   pnpm install
   pnpm prepare
   ```

### Available Commands

#### Backend

```bash
cd LocalMind-Backend

pnpm lint          # Check for linting errors
pnpm lint:fix      # Automatically fix linting errors
pnpm format        # Format code with Prettier
pnpm format:check  # Check code formatting without changing files
pnpm type-check    # Check TypeScript types
```

#### Frontend

```bash
cd LocalMind-Frontend

pnpm lint          # Check for linting errors
pnpm lint:fix      # Automatically fix linting errors
pnpm format        # Format code with Prettier
pnpm format:check  # Check code formatting without changing files
pnpm type-check    # Check TypeScript types
```

#### Root (Run for both)

```bash
# From project root
pnpm lint          # Lint both backend and frontend
pnpm lint:fix      # Fix linting errors in both
pnpm format        # Format both backend and frontend
pnpm format:check  # Check formatting in both
```

### Pre-commit Hooks

**Husky** automatically runs linting and formatting on staged files before each commit:

- ✅ Automatically formats code with Prettier
- ✅ Fixes ESLint errors when possible
- ✅ Prevents commits with linting errors

To bypass hooks (not recommended):

```bash
git commit --no-verify
```

### Editor Integration (VS Code)

1. **Install recommended extensions:**

   - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. **Settings are already configured** in `.vscode/settings.json`:

   - Format on save enabled
   - ESLint auto-fix on save enabled
   - Prettier as default formatter

3. **Reload VS Code** after installing extensions

### Configuration Files

- **`.prettierrc`** - Shared Prettier configuration
- **`.prettierignore`** - Files to ignore when formatting
- **`LocalMind-Backend/eslint.config.js`** - Backend ESLint config
- **`LocalMind-Frontend/eslint.config.js`** - Frontend ESLint config

### Rules & Standards

- **TypeScript**: Strict mode enabled, no `any` types (warnings)
- **Code Style**: Single quotes, no semicolons, 2-space indentation
- **Unused Variables**: Allowed if prefixed with `_`
- **Console**: Only `console.warn` and `console.error` allowed

---

## 📁 Project Structure

```
LocalMind/
│
├── assets/                          # Project assets and media
│   ├── Banner_LocalMind.png        # Main banner image
│   └── screenshots/                # Application screenshots for documentation
│       ├── chat-interface.png
│       ├── model-selection.png
│       ├── rag-upload.png
│       ├── dashboard.png
│       └── streaming-response.png
│
├── LocalMind-Backend/              # Backend Node.js/Express application
│   ├── src/
│   │   ├── api/
│   │   │   └── v1/                # API v1 routes and controllers
│   │   │       ├── Ai-model/      # AI model integrations
│   │   │       │   ├── Google/    # Google Gemini integration
│   │   │       │   ├── Groq/      # Groq integration
│   │   │       │   └── Ollama/    # Ollama local models
│   │   │       ├── AiModelConfig/ # AI configuration management
│   │   │       ├── DataSet/       # Dataset upload & management
│   │   │       └── user/          # User authentication & management
│   │   ├── config/                # Configuration files
│   │   │   └── mongoose.connection.ts
│   │   ├── constant/              # Application constants
│   │   │   ├── env.constant.ts
│   │   │   └── Status.constant.ts
│   │   ├── data/                  # Sample data files
│   │   │   └── Sample.csv
│   │   ├── doc/                   # API documentation
│   │   ├── routes/                # Route aggregation
│   │   │   └── app.ts
│   │   ├── Template/              # AI prompt templates
│   │   │   └── v1/
│   │   │       ├── Ai.template.ts
│   │   │       └── text/
│   │   ├── utils/                 # Utility functions
│   │   │   └── SendResponse.utils.ts
│   │   ├── validator/             # Input validation schemas
│   │   │   └── env.ts
│   │   └── server.ts              # Application entry point
│   ├── types/                     # TypeScript type definitions
│   │   └── express.d.ts
│   ├── .env.example               # Environment variables template
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── jest.config.ts             # Jest testing configuration
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── setup-cloudflare.sh        # Cloudflare tunnel setup script
│   └── tsconfig.json              # TypeScript configuration
│
├── LocalMind-Frontend/             # Frontend React application
│   ├── public/                    # Static assets served directly
│   ├── src/
│   │   ├── app/                   # Core application components
│   │   │   ├── css/
│   │   │   │   └── global.css    # Global styles
│   │   │   ├── routes/           # Route definitions
│   │   │   │   ├── AdminRoutes.tsx
│   │   │   │   ├── AppRoutes.tsx
│   │   │   │   ├── PrivateRoute.tsx
│   │   │   │   └── UserRoutes.tsx
│   │   │   ├── store/            # State management
│   │   │   │   └── store.ts
│   │   │   └── App.tsx           # Root component
│   │   ├── assets/               # Images, fonts, icons
│   │   │   └── Fonts/
│   │   ├── constants/            # Frontend constants
│   │   ├── core/                 # Core utilities
│   │   ├── features/             # Feature-based modules
│   │   │   ├── Dashboard/
│   │   │   │   └── V1/
│   │   │   └── Homepage/
│   │   │       └── V1/
│   │   │           ├── Components/
│   │   │           └── Homepage.tsx
│   │   ├── hooks/                # Custom React hooks
│   │   ├── shared/               # Shared components
│   │   │   └── component/
│   │   │       └── v1/
│   │   │           ├── Card.tsx
│   │   │           └── Navbar.tsx
│   │   ├── types/                # TypeScript interfaces
│   │   │   └── Interfaces.ts
│   │   └── index.tsx             # Application entry point
│   ├── .gitignore
│   ├── eslint.config.js          # ESLint configuration
│   ├── index.html                # HTML template
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── README.md
│   ├── tsconfig.app.json         # TypeScript app config
│   ├── tsconfig.json             # TypeScript base config
│   ├── tsconfig.node.json        # TypeScript Node config
│   └── vite.config.ts            # Vite build configuration
│
├── .gitignore                     # Git ignore rules
├── Contributing.md                # Contribution guidelines
├── docker-compose.yml             # Docker Compose configuration
├── dockerfile.md                  # Dockerfile documentation
├── env.example                    # Root environment template
├── LICENSE                        # MIT License
├── package.json                   # Root package.json (workspace)
└── README.md                      # This file
```

### Directory Purpose Explanation

#### Backend (`LocalMind-Backend/`)

- **`src/api/v1/`** — Versioned API routes, controllers, and services
- **`src/config/`** — Database connections and app configuration
- **`src/constant/`** — Environment variables and status codes
- **`src/Template/`** — AI system prompts and templates
- **`src/utils/`** — Helper functions for responses, validation
- **`types/`** — TypeScript type extensions and declarations

#### Frontend (`LocalMind-Frontend/`)

- **`src/app/`** — Application shell, routing, and global state
- **`src/features/`** — Feature-based architecture (Dashboard, Homepage, etc.)
- **`src/shared/`** — Reusable UI components (Card, Navbar)
- **`src/hooks/`** — Custom React hooks for logic reuse
- **`src/types/`** — TypeScript interfaces and types

---

## 🧩 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 🔐 Authentication & User Management

#### Register User

```http
POST /api/v1/user/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "abc123",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```http
POST /api/v1/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### Get User Profile

```http
GET /api/v1/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Profile

```http
PUT /api/v1/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "username": "john_updated",
  "preferences": {
    "defaultModel": "gemini-pro",
    "theme": "dark"
  }
}
```

---

### ⚙️ AI Configuration & API Keys

#### Generate LocalMind API Key

```http
POST /api/v1/user/local-mind-api-key-generator
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Production API Key",
  "permissions": ["chat", "upload", "train"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "apiKey": "lm_1234567890abcdef",
    "name": "Production API Key",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### List API Keys

```http
GET /api/v1/user/local-mind-api-keys
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete API Key

```http
DELETE /api/v1/user/local-mind-api-keys/:keyId
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get AI Configuration

```http
GET /api/v1/user/ai-config
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update AI Configuration

```http
PUT /api/v1/user/ai-config
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "providers": {
    "gemini": {
      "enabled": true,
      "apiKey": "your-gemini-key"
    },
    "ollama": {
      "enabled": true,
      "host": "http://localhost:11434"
    }
  },
  "defaultModel": "gemini-pro"
}
```

---

### 💬 Chat & Messaging

#### Send Message

```http
POST /api/v1/chat/send-message
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "message": "What is quantum computing?",
  "model": "gemini-pro",
  "conversationId": "conv_123",
  "useRAG": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "messageId": "msg_456",
    "response": "Quantum computing is...",
    "model": "gemini-pro",
    "timestamp": "2024-01-15T10:30:00Z",
    "tokensUsed": 245
  }
}
```

#### Stream Message (SSE)

```http
POST /api/v1/chat/stream
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "message": "Write a poem about AI",
  "model": "gpt-4"
}
```

#### Get Chat History

```http
GET /api/v1/chat/history?conversationId=conv_123&limit=50
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create New Conversation

```http
POST /api/v1/chat/conversation
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Project Discussion",
  "model": "gemini-pro"
}
```

#### Delete Conversation

```http
DELETE /api/v1/chat/conversation/:conversationId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 📚 File Upload & RAG Training

#### Upload Excel/CSV

```http
POST /api/v1/upload/excel
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

file: [your-file.xlsx]
name: "Sales Data Q4"
description: "Quarterly sales figures"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fileId": "file_789",
    "name": "Sales Data Q4",
    "size": 2048576,
    "rowCount": 1500,
    "status": "processing"
  }
}
```

#### Upload Q&A Dataset

```http
POST /api/v1/upload/dataSet
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "FAQ Dataset",
  "questions": [
    {
      "question": "What is LocalMind?",
      "answer": "LocalMind is an open-source AI platform..."
    }
  ]
}
```

#### Train Model with Uploaded Data

```http
POST /api/v1/train/upload
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "fileId": "file_789",
  "chunkSize": 500,
  "overlapSize": 50
}
```

#### Get Upload Status

```http
GET /api/v1/upload/status/:fileId
Authorization: Bearer YOUR_JWT_TOKEN
```

#### List Uploaded Files

```http
GET /api/v1/upload/files
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Uploaded File

```http
DELETE /api/v1/upload/files/:fileId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 🌐 Public Exposure

#### Expose via LocalTunnel

```http
POST /api/v1/expose/localtunnel
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "subdomain": "my-awesome-ai",
  "port": 3000
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://my-awesome-ai.loca.lt",
    "status": "active"
  }
}
```

#### Expose via Ngrok

```http
POST /api/v1/expose/ngrok
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "authToken": "your-ngrok-token",
  "domain": "myapp.ngrok.io"
}
```

#### Get Exposure Status

```http
GET /api/v1/expose/status
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Stop Exposure

```http
DELETE /api/v1/expose/stop
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 📊 Analytics & Monitoring

#### Get Usage Statistics

```http
GET /api/v1/analytics/usage
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Model Performance

```http
GET /api/v1/analytics/models
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💡 Usage Examples

### Example 1: Basic Chat

```javascript
// Initialize client
const API_URL = 'http://localhost:3000/api/v1'
const token = 'your-jwt-token'

// Send message
const response = await fetch(`${API_URL}/chat/send-message`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    message: 'Explain machine learning in simple terms',
    model: 'gemini-pro',
  }),
})

const data = await response.json()
console.log(data.data.response)
```

### Example 2: Upload and Train with Custom Data

```javascript
// Upload Excel file
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('name', 'Company Knowledge Base')

const uploadResponse = await fetch(`${API_URL}/upload/excel`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})

const {
  data: { fileId },
} = await uploadResponse.json()

// Train model with uploaded data
const trainResponse = await fetch(`${API_URL}/train/upload`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    fileId,
    chunkSize: 500,
  }),
})

// Use RAG-enhanced chat
const chatResponse = await fetch(`${API_URL}/chat/send-message`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    message: 'What does our policy say about remote work?',
    useRAG: true,
  }),
})
```

### Example 3: Streaming Responses

```javascript
const eventSource = new EventSource(
  `${API_URL}/chat/stream?token=${token}&message=Write a story about AI`
)

eventSource.onmessage = event => {
  const chunk = JSON.parse(event.data)
  console.log(chunk.content) // Display chunk in real-time
}

eventSource.onerror = () => {
  eventSource.close()
}
```

### Example 4: Expose Your AI Globally

```javascript
// Start LocalTunnel
const exposeResponse = await fetch(`${API_URL}/expose/localtunnel`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    subdomain: 'my-ai-demo',
  }),
})

const {
  data: { url },
} = await exposeResponse.json()
console.log(`Your AI is now accessible at: ${url}`)
```

---

## 🛠️ Tech Stack

### Backend

| Technology           | Purpose               | Version |
| -------------------- | --------------------- | ------- |
| **Node.js**          | Runtime environment   | 18+     |
| **Express**          | Web framework         | 4.x     |
| **TypeScript**       | Type safety           | 5.x     |
| **Prisma / MongoDB** | Database ORM          | Latest  |
| **JWT**              | Authentication        | Latest  |
| **Multer**           | File uploads          | Latest  |
| **LangChain**        | RAG implementation    | Latest  |
| **Ollama SDK**       | Local LLM integration | Latest  |

### Frontend

| Technology       | Purpose          | Version |
| ---------------- | ---------------- | ------- |
| **React**        | UI framework     | 18+     |
| **TypeScript**   | Type safety      | 5.x     |
| **Vite**         | Build tool       | 5.x     |
| **TailwindCSS**  | Styling          | 3.x     |
| **Zustand**      | State management | Latest  |
| **React Query**  | Data fetching    | Latest  |
| **React Router** | Navigation       | 6.x     |
| **Axios**        | HTTP client      | Latest  |

### AI & ML

- **Ollama** — Local LLM runtime
- **LangChain** — RAG framework
- **Vector Databases** — Embeddings storage
- **Google Gemini SDK**
- **OpenAI SDK**
- **Groq SDK**

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Won't Start

**Problem:** `Error: Cannot find module 'express'`

**Solution:**

```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 2. Ollama Connection Failed

**Problem:** `Error: ECONNREFUSED localhost:11434`

**Solution:**

- Ensure Ollama is installed and running: `ollama serve`
- Check Ollama status: `ollama list`
- Verify OLLAMA_HOST in `.env`

#### 3. File Upload Fails

**Problem:** `Error: File size exceeds limit`

**Solution:**

- Check MAX_FILE_SIZE in `.env`
- Increase the limit if needed
- Compress large files before uploading

#### 4. RAG Not Working

**Problem:** AI doesn't use uploaded data

**Solution:**

- Verify file was processed: `GET /api/v1/upload/status/:fileId`
- Ensure `useRAG: true` in chat request
- Check vector database path in `.env`

#### 5. CORS Errors

**Problem:** `Access-Control-Allow-Origin` error

**Solution:**

- Update CORS_ORIGIN in server `.env`
- Restart backend server
- Check frontend URL matches CORS_ORIGIN

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2024)

- [ ] PDF and TXT file support for RAG
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Voice input/output
- [ ] Mobile-responsive design improvements

### Version 1.2 (Q3 2024)

- [ ] Anthropic Claude integration
- [ ] Image generation support
- [ ] Code execution sandbox
- [ ] Collaborative chat sessions
- [ ] Advanced analytics dashboard

### Version 2.0 (Q4 2024)

- [ ] Plugin system for extensions
- [ ] Marketplace for custom models
- [ ] Enterprise features (SSO, RBAC)
- [ ] Kubernetes deployment support
- [ ] Multi-user workspaces

### Community Requests

- [ ] WhatsApp/Telegram bot integration
- [ ] Markdown export for conversations
- [ ] Custom model fine-tuning UI
- [ ] Blockchain-based API key management

**Want to suggest a feature?** [Open an issue](https://github.com/NexGenStudioDev/LocalMind/issues) or join our [Discord community](#)!

---

## 🤝 Contributing

We ❤️ contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** — Found a bug? [Open an issue](https://github.com/NexGenStudioDev/LocalMind/issues)
- 💡 **Suggest features** — Have ideas? Share them!
- 📝 **Improve docs** — Help others understand LocalMind
- 🔧 **Submit PRs** — Fix bugs or add features
- 🌍 **Translate** — Make LocalMind accessible worldwide
- ⭐ **Star the repo** — Show your support!

### Development Workflow

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/LocalMind.git
   cd LocalMind
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**

   - Follow TypeScript best practices
   - Write clean, documented code
   - Add tests for new features
   - Update documentation

4. **Test your changes**

   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit with conventional commits**

   ```bash
   git commit -m "feat: add amazing feature"
   git commit -m "fix: resolve bug in chat"
   git commit -m "docs: update API documentation"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   # Then open a Pull Request on GitHub
   ```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Build process or auxiliary tool changes

### Code Style

- **TypeScript** — Use strict typing, avoid `any`
- **ESLint** — Follow configured rules
- **Prettier** — Auto-format on save
- **Naming** — Use camelCase for variables, PascalCase for components
- **Comments** — Document complex logic

### Pull Request Process

1. Update README.md with details of changes if needed
2. Update the documentation with new API endpoints
3. Add tests for new functionality
4. Ensure all tests pass
5. Request review from maintainers
6. Address review feedback
7. Squash commits before merging

### Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

### What This Means

✅ **Commercial use** — Use LocalMind in commercial projects  
✅ **Modification** — Modify the code as you see fit  
✅ **Distribution** — Share LocalMind with others  
✅ **Private use** — Use it privately in your organization

⚠️ **Limitation of liability** — Use at your own risk  
⚠️ **No warranty** — Provided "as is"

**Attribution appreciated but not required!** If you build something cool with LocalMind, let us know — we'd love to feature it!

---

## 🙏 Acknowledgments

LocalMind stands on the shoulders of giants. Huge thanks to:

### Open Source Projects

- **[Ollama](https://ollama.ai/)** — Making local LLMs accessible
- **[LangChain](https://langchain.com/)** — Powering our RAG implementation
- **[React](https://reactjs.org/)** — Building amazing UIs
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool
- **[Express](https://expressjs.com/)** — Reliable backend framework

### AI Providers

- **Google** — Gemini API
- **OpenAI** — GPT models
- **Meta** — LLaMA models
- **Mistral AI** — Open models
- **Groq** — Fast inference

### Community

- All our [contributors](https://github.com/NexGenStudioDev/LocalMind/graphs/contributors)
- Everyone who reported bugs and suggested features
- The open-source community for inspiration

### Special Thanks

- **Students and educators** using LocalMind for learning
- **Developers** building amazing apps with our API
- **Contributors** who helped improve the codebase
- **You** for choosing LocalMind! 🎉

---

## 👤 Author

**NexGenStudioDev**

### Connect With Us

- 🌐 **Website:** [Coming Soon]
- 💼 **GitHub:** [@NexGenStudioDev](https://github.com/NexGenStudioDev)
- 🐦 **Twitter:** [Coming Soon]
- 💬 **Discord:** [Join our community](#)
- 📧 **Email:** support@localmind.ai

### Support the Project

If LocalMind has been helpful to you:

- ⭐ **Star this repository** on GitHub
- 🐦 **Share it** on social media
- 📝 **Write about it** on your blog
- 💰 **Sponsor development** (Coming Soon)
- 🤝 **Contribute code** or documentation

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/NexGenStudioDev/LocalMind?style=social)
![GitHub forks](https://img.shields.io/github/forks/NexGenStudioDev/LocalMind?style=social)
![GitHub issues](https://img.shields.io/github/issues/NexGenStudioDev/LocalMind)
![GitHub pull requests](https://img.shields.io/github/issues-pr/NexGenStudioDev/LocalMind)
![GitHub license](https://img.shields.io/github/license/NexGenStudioDev/LocalMind)

---

## 🎯 Support

### Getting Help

- 📖 **Documentation:** Read our [full docs](#)
- 💬 **Discord:** Join our [community server](#)
- 🐛 **Bug Reports:** [Open an issue](https://github.com/NexGenStudioDev/LocalMind/issues)
- 💡 **Feature Requests:** [Suggest features](https://github.com/NexGenStudioDev/LocalMind/discussions)
- 📧 **Email:** support@localmind.ai

### FAQ

**Q: Is LocalMind really free?**  
A: Yes! 100% free and open-source. No hidden costs, no premium tiers, no subscriptions.

**Q: Can I use LocalMind commercially?**  
A: Absolutely! The MIT license allows commercial use.

**Q: Do I need a GPU for local models?**  
A: Recommended but not required. Ollama works on CPU, but GPU speeds things up significantly.

**Q: How much disk space do I need?**  
A: Base installation: ~500MB. Each Ollama model: 2-7GB depending on size.

**Q: Can I deploy LocalMind to production?**  
A: Yes! Use Docker for easy deployment. See our [deployment guide](#).

**Q: Is my data secure?**  
A: Yes. RAG data stays on your machine. API keys are encrypted. No telemetry or tracking.

**Q: Can I contribute without coding?**  
A: Yes! Help with documentation, translations, bug reports, or spread the word.

---

<div align="center">
  <br/>
  <h3>🚀 LocalMind — Free, Private, Limitless AI for Everyone</h3>
  <p>Built with ❤️ by the open-source community</p>
  <br/>
  
  **[Get Started](#-quick-start)** • **[Documentation](#)** • **[Join Community](#)** • **[Report Bug](https://github.com/NexGenStudioDev/LocalMind/issues)**
  
  <br/>
  
  <sub>If you find LocalMind useful, please consider giving it a ⭐️ on GitHub!</sub>
</div>

---

# 🐳 Docker Deployment Guide

This guide will help you deploy LocalMind using Docker for a consistent, portable, and production-ready setup.

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Docker** (v20.10 or higher) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0 or higher) - Usually included with Docker Desktop

Verify installation:

```bash
docker --version
docker compose version
```

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/LocalMind.git
   cd LocalMind
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   nano .env  # Edit with your preferred editor
   ```

   **Required variables to set:**

   - `LOCALMIND_SECRET` - Generate with: `openssl rand -base64 32`
   - Add API keys for cloud providers (optional)

3. **Start the application:**

   ```bash
   docker compose up -d
   ```

4. **Access LocalMind:**

   - Open your browser: http://localhost:3000
   - The application will serve both backend API and frontend

5. **View logs:**
   ```bash
   docker compose logs -f localmind
   ```

### Option 2: Using Docker CLI

1. **Build the image:**

   ```bash
   docker build -t localmind:latest .
   ```

2. **Run the container:**

   ```bash
   docker run -d \
     --name localmind-app \
     -p 3000:3000 \
     -e LOCALMIND_SECRET="your-secret-key" \
     -e API_KEY="your-api-key" \
     -e OLLAMA_HOST="http://host.docker.internal:11434" \
     -v localmind-uploads:/app/uploads \
     -v localmind-data:/app/data \
     localmind:latest
   ```

3. **Access the application:**
   - http://localhost:3000

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable           | Description       | Required | Default                             |
| ------------------ | ----------------- | -------- | ----------------------------------- |
| `NODE_ENV`         | Environment mode  | No       | `production`                        |
| `PORT`             | Application port  | No       | `3000`                              |
| `LOCALMIND_SECRET` | JWT secret key    | **Yes**  | -                                   |
| `API_KEY`          | Generic API key   | No       | -                                   |
| `OPENAI_API_KEY`   | OpenAI API key    | No       | -                                   |
| `GEMINI_API_KEY`   | Google Gemini key | No       | -                                   |
| `GROQ_API_KEY`     | Groq API key      | No       | -                                   |
| `OLLAMA_HOST`      | Ollama server URL | No       | `http://host.docker.internal:11434` |

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

### Connecting to Ollama

**If Ollama runs on your host machine:**

```env
OLLAMA_HOST=http://host.docker.internal:11434
```

**If Ollama runs in Docker (uncomment the ollama service in docker-compose.yml):**

```env
OLLAMA_HOST=http://ollama:11434
```

---

## 📦 Docker Commands Reference

### Building & Running

```bash
# Build the image
docker build -t localmind:latest .

# Run container (basic)
docker run -d -p 3000:3000 --name localmind-app localmind:latest

# Run with environment variables
docker run -d -p 3000:3000 \
  --env-file .env \
  --name localmind-app \
  localmind:latest

# Run with volumes (persist data)
docker run -d -p 3000:3000 \
  -v localmind-uploads:/app/uploads \
  -v localmind-data:/app/data \
  --name localmind-app \
  localmind:latest
```

### Managing Containers

```bash
# Start container
docker start localmind-app

# Stop container
docker stop localmind-app

# Restart container
docker restart localmind-app

# View logs
docker logs localmind-app
docker logs -f localmind-app  # Follow logs

# Check container status
docker ps -a

# Execute commands in running container
docker exec -it localmind-app sh
```

### Docker Compose Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build

# Scale services (if needed)
docker compose up -d --scale localmind=3
```

### Cleanup

```bash
# Remove container
docker rm -f localmind-app

# Remove image
docker rmi localmind:latest

# Remove volumes (⚠️ permanent data loss)
docker volume rm localmind-uploads localmind-data

# Clean up all unused resources
docker system prune -a --volumes
```

---

## 🔍 Troubleshooting

### Container won't start

**Check logs:**

```bash
docker logs localmind-app
```

**Common issues:**

- Missing required environment variables
- Port 3000 already in use
- Insufficient permissions

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Change port in docker-compose.yml
ports:
  - "8080:3000"  # Access via localhost:8080
```

### Can't connect to Ollama

1. **Verify Ollama is running:**

   ```bash
   curl http://localhost:11434/api/version
   ```

2. **Check Docker network:**

   ```bash
   docker network inspect localmind-network
   ```

3. **Use correct host:**
   - Host machine: `http://host.docker.internal:11434`
   - Docker container: `http://ollama:11434`

### Permission denied errors

```bash
# Fix volume permissions
docker exec -it localmind-app chown -R localmind:localmind /app/uploads /app/data
```

### Out of memory

**Increase Docker resources:**

- Docker Desktop → Settings → Resources → Memory (increase to 4GB+)

**Or limit container memory:**

```bash
docker run -d -p 3000:3000 \
  --memory="2g" \
  --name localmind-app \
  localmind:latest
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files:**

   ```bash
   # Ensure .env is in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use strong secrets:**

   ```bash
   # Generate secure random secret
   openssl rand -base64 32
   ```

3. **Run as non-root user:**

   - The Dockerfile already implements this
   - User `localmind` (UID 1001) is used

4. **Keep images updated:**

   ```bash
   docker pull node:20-alpine
   docker compose build --no-cache
   ```

5. **Scan for vulnerabilities:**
   ```bash
   docker scan localmind:latest
   ```

---

## 🚢 Production Deployment

### Using Docker Compose (Production)

1. **Create production docker-compose:**

   ```bash
   cp docker-compose.yml docker-compose.prod.yml
   ```

2. **Update production settings:**

   ```yaml
   environment:
     - NODE_ENV=production
     - LOG_LEVEL=error
   ```

3. **Deploy:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Behind a Reverse Proxy (Nginx/Traefik)

**Example Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Health Checks

The container includes a health check endpoint:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' localmind-app

# Manual health check
curl http://localhost:3000/health
```

---

## 🎯 Performance Optimization

### Multi-stage Build Benefits

The Dockerfile uses multi-stage builds to:

- Reduce final image size by ~60%
- Separate build and runtime dependencies
- Improve build caching

### Image Size Comparison

- **Without optimization:** ~800MB
- **With multi-stage build:** ~300MB

### Build with BuildKit (faster builds)

```bash
DOCKER_BUILDKIT=1 docker build -t localmind:latest .
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:** `docker logs localmind-app`
2. **Verify environment:** `docker exec localmind-app env`
3. **Open an issue:** [GitHub Issues](https://github.com/your-username/LocalMind/issues)
4. **Community support:** [Discord/Forum link]

---

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)
- [Ollama Docker Setup](https://ollama.ai/docs/docker)

---

**🎉 You're all set! Your LocalMind instance is now running in Docker.**

## 📝 Changelog

### [v1.0.0] - 2024-01-15

#### Added

- 🎉 Initial release of LocalMind
- 🧠 Support for Ollama local models
- ☁️ Cloud AI integrations (Gemini, OpenAI, Groq, RouterAI)
- 📚 RAG with Excel/CSV uploads
- 🌐 LocalTunnel and Ngrok support
- 🔐 JWT authentication
- 💬 Real-time chat interface
- 📊 Usage analytics
- 🎨 Modern React UI with Tailwind CSS

#### Security

- Implemented bcrypt password hashing
- Added CORS protection
- Rate limiting for API endpoints
- Input validation and sanitization

---

<div align="center">
  <br/>
  <p>Made with ⚡ by <b>NexGenStudioDev</b></p>
  <p>
    <a href="#-overview">Back to top ↑</a>
  </p>
</div>
