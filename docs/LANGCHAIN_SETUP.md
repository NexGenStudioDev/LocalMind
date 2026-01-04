# LangChain Integration Guide

## Overview

This guide explains how to use LangChain with LocalMind for advanced AI processing, including:

- OpenAI ChatGPT integration
- Prompt template management
- Runnable sequence chains
- Streaming responses
- Custom template execution

LangChain provides a framework for building AI applications with support for multiple LLM providers, prompt engineering, and complex AI workflows.

## Prerequisites

- **OpenAI API Key** - Required for ChatGPT models
- **Node.js** 18+ installed
- **LocalMind Backend** setup complete

## Configuration

### 1. Environment Variables

Add these to your `.env` file in `LocalMind-Backend/`:

```dotenv
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

**Available Models:**

- `gpt-4o` - Most capable, higher cost
- `gpt-4o-mini` - Balanced performance (recommended)
- `gpt-4-turbo` - Fast and capable
- `gpt-3.5-turbo` - Fastest, lower cost

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)
4. Paste into your `.env` file

**Important:** Never commit API keys to version control!

## Architecture

### Service Layer

**File:** `src/services/langchain.service.ts`

The LangChain service provides:

- `getChatModel()` - Get configured ChatOpenAI instance
- `runSimplePrompt()` - Execute system + user prompt
- `runUserPrompt()` - Execute user-only prompt
- `runCustomTemplate()` - Execute custom templates with variables
- `streamPrompt()` - Stream responses token by token

### Controller Layer

**File:** `src/api/v1/LangChain/langchain.controller.ts`

HTTP endpoints for:

- Health checks
- Test queries
- Simple chat
- Template execution

## API Endpoints

### GET `/api/v1/langchain/health`

Check if LangChain is configured and operational.

**Response:**

```json
{
  "success": true,
  "message": "LangChain is configured and ready",
  "data": {
    "status": "operational",
    "model": "gpt-4o-mini",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

**Test:**

```bash
curl http://localhost:5000/api/v1/langchain/health
```

---

### GET `/api/v1/langchain/test`

Run a simple test query to verify the setup.

**Response:**

```json
{
  "success": true,
  "message": "LangChain test successful",
  "data": {
    "testPrompt": "Say hello in one sentence and confirm you are working correctly.",
    "response": "Hello! I'm working correctly and ready to assist you.",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Test:**

```bash
curl http://localhost:5000/api/v1/langchain/test
```

---

### POST `/api/v1/langchain/chat`

Chat with AI using system and user prompts.

**Request Body:**

```json
{
  "systemPrompt": "You are a helpful coding assistant",
  "userPrompt": "Write a Python function to reverse a string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "def reverse_string(s):\n    return s[::-1]",
    "systemPrompt": "You are a helpful coding assistant",
    "userPrompt": "Write a Python function to reverse a string"
  }
}
```

**Test:**

```bash
curl -X POST http://localhost:5000/api/v1/langchain/chat \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are a helpful assistant",
    "userPrompt": "Explain quantum computing in one sentence"
  }'
```

---

### POST `/api/v1/langchain/prompt`

Simple user prompt without system message.

**Request Body:**

```json
{
  "prompt": "What is the capital of France?"
}
```

**Response:**

```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "The capital of France is Paris.",
    "prompt": "What is the capital of France?"
  }
}
```

---

### POST `/api/v1/langchain/template`

Execute custom templates with variables.

**Request Body:**

```json
{
  "template": "Translate '{text}' from {fromLang} to {toLang}",
  "variables": {
    "text": "Hello, how are you?",
    "fromLang": "English",
    "toLang": "Spanish"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Template executed successfully",
  "data": {
    "response": "Hola, ¿cómo estás?",
    "template": "Translate '{text}' from {fromLang} to {toLang}",
    "variables": { ... }
  }
}
```

## Usage in Code

### Example 1: Simple Chat

```typescript
import langchainService from './services/langchain.service'

const response = await langchainService.runSimplePrompt(
  'You are a helpful assistant',
  'Explain machine learning in simple terms'
)

console.log(response)
```

### Example 2: Custom Template

```typescript
const response = await langchainService.runCustomTemplate(
  'Write a {type} about {topic} in {style} style',
  {
    type: 'poem',
    topic: 'artificial intelligence',
    style: 'haiku',
  }
)
```

### Example 3: Streaming Responses

```typescript
await langchainService.streamPrompt(
  'You are a storyteller',
  'Tell me a short story about AI',
  token => {
    // Called for each token
    process.stdout.write(token)
  }
)
```

### Example 4: Using in Your Controller

```typescript
import langchainService from '../services/langchain.service'

class MyController {
  async generateText(req: Request, res: Response) {
    const { prompt } = req.body

    const response = await langchainService.runUserPrompt(prompt)

    res.json({ success: true, data: response })
  }
}
```

## Advanced Features

### Prompt Templates

LangChain supports complex prompt templates with:

- **Variables:** `{variable_name}`
- **Conditional logic**
- **Multi-turn conversations**
- **Chat history management**

### Runnable Sequences

Chain multiple operations:

```typescript
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const prompt = ChatPromptTemplate.fromTemplate('Translate: {text}')
const chain = RunnableSequence.from([prompt, chatModel])
const result = await chain.invoke({ text: 'Hello' })
```

### Streaming

For real-time responses:

```typescript
const stream = await langchainService.streamPrompt(
  'You are a creative writer',
  'Write a haiku about technology'
)
```

## Troubleshooting

### Issue: "OPENAI_API_KEY is not configured"

**Solution:**

1. Check that `.env` file exists in `LocalMind-Backend/`
2. Verify `OPENAI_API_KEY` is set correctly
3. Restart the backend server

```bash
# Verify env loading
cd LocalMind-Backend
cat .env | grep OPENAI_API_KEY
pnpm dev
```

---

### Issue: "Request failed with status code 401"

**Cause:** Invalid or expired API key

**Solution:**

1. Generate a new key at https://platform.openai.com/api-keys
2. Update `.env` with the new key
3. Restart server

---

### Issue: "Rate limit exceeded"

**Cause:** Too many API requests

**Solution:**

- Use a different OpenAI model with higher limits
- Implement request throttling
- Upgrade your OpenAI plan

---

### Issue: "Model not found"

**Cause:** Invalid model name in `OPENAI_MODEL`

**Solution:**
Use a valid model name:

```dotenv
OPENAI_MODEL=gpt-4o-mini  # Recommended
# OR
OPENAI_MODEL=gpt-3.5-turbo  # Faster/cheaper
```

---

### Issue: Slow responses

**Solutions:**

1. Use faster models: `gpt-3.5-turbo` or `gpt-4o-mini`
2. Reduce `maxTokens` in service configuration
3. Implement caching for repeated queries

## Cost Management

### Token Usage

- **gpt-4o-mini:** ~$0.15 / 1M input tokens, ~$0.60 / 1M output tokens
- **gpt-3.5-turbo:** ~$0.50 / 1M input tokens, ~$1.50 / 1M output tokens
- **gpt-4o:** ~$5.00 / 1M input tokens, ~$15.00 / 1M output tokens

### Best Practices

1. **Set token limits:** Configure `maxTokens` in service
2. **Use cheaper models** for simple tasks
3. **Cache responses** for repeated queries
4. **Monitor usage:** Check OpenAI dashboard regularly

## Integration with RAG

LangChain is essential for RAG (Retrieval-Augmented Generation):

```typescript
// Example: RAG with LangChain
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'

// 1. Create embeddings
const embeddings = new OpenAIEmbeddings()

// 2. Store documents
const vectorStore = await MemoryVectorStore.fromTexts(['Document 1', 'Document 2'], {}, embeddings)

// 3. Retrieve relevant context
const docs = await vectorStore.similaritySearch('query')

// 4. Use with LangChain
const response = await langchainService.runSimplePrompt(
  `Use this context: ${docs[0].pageContent}`,
  'Answer the question'
)
```

See [docs/RAG_SETUP.md](./RAG_SETUP.md) for full RAG implementation.

## Security Best Practices

1. **Never commit `.env`** - Add to `.gitignore`
2. **Use environment variables** - No hardcoded keys
3. **Rotate keys regularly** - Generate new keys monthly
4. **Implement rate limiting** - Prevent abuse
5. **Validate input** - Sanitize user prompts
6. **Monitor costs** - Set up billing alerts

## Next Steps

- ✅ Configure LangChain
- ⏭️ Implement RAG (Issue #21)
- ⏭️ Add streaming support in frontend
- ⏭️ Build custom AI agents
- ⏭️ Integrate with Socket.IO for real-time chat

## Additional Resources

- **Official Docs:** https://langchain.com/docs/
- **API Reference:** https://api.js.langchain.com/
- **Examples:** https://github.com/langchain-ai/langchainjs/tree/main/examples
- **OpenAI Docs:** https://platform.openai.com/docs/

## Code Reference

**Files Created:**

- `src/services/langchain.service.ts` - Core LangChain service
- `src/api/v1/LangChain/langchain.controller.ts` - HTTP controllers
- `src/api/v1/LangChain/langchain.routes.ts` - API routes
- `docs/LANGCHAIN_SETUP.md` - This documentation

**Environment:**

- `.env` - Configuration (OPENAI_API_KEY, OPENAI_MODEL)
- `src/validator/env.ts` - Environment validation

---

**Need help?** Open an issue on [GitHub](https://github.com/NexGenStudioDev/LocalMind/issues) with the `langchain` label.
