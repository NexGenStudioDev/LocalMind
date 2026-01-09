# Ollama Integration Guide

## Overview

This guide walks you through setting up Ollama AI integration with LocalMind. Ollama allows you to run powerful open-source LLMs locally on your machine without needing cloud API keys or internet connectivity.

## Prerequisites

- **RAM:** 8GB minimum (16GB+ recommended for larger models)
- **Disk Space:** At least 10GB free for models
- **OS:** macOS, Linux, or Windows (WSL2)

## Installation

### macOS / Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

Download and install from: https://ollama.com/download/windows

### Verify Installation

```bash
ollama --version
```

You should see output like:
```
ollama version is 0.1.x
```

## Model Setup

### 1. Pull Recommended Models

```bash
# Recommended default model (best balance)
ollama pull llama3

# Alternative models
ollama pull mistral        # Faster, 7B parameters
ollama pull phi            # Lightweight, great for edge
ollama pull gemma          # Google's open model
```

### 2. Verify Model Installation

```bash
ollama list
```

Expected output:
```
NAME            ID              SIZE      MODIFIED
llama3:latest   abc123def456    4.7 GB    2 minutes ago
mistral:latest  xyz789ghi012    4.1 GB    5 minutes ago
```

## Configuration

### 1. Environment Variables

Add these to your `.env` file in `LocalMind-Backend/`:

```dotenv
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3
```

### 2. Start Ollama Server

The Ollama server needs to be running for LocalMind to communicate with it.

**macOS/Linux:**
```bash
ollama serve
```

**Windows:**
- The Ollama service starts automatically after installation
- Check status with: `ollama serve` in PowerShell

Keep this terminal open while using Ollama with LocalMind.

## Testing Integration

### Method 1: Using LocalMind API

1. **Start LocalMind Backend:**
   ```bash
   cd LocalMind-Backend
   pnpm dev
   ```

2. **Test Ollama Status:**
   ```bash
   curl http://localhost:5000/api/v1/ollama/status
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "Ollama is running and accessible",
     "data": {
       "status": "online",
       "host": "http://localhost:11434",
       "models": [
         {
           "name": "llama3:latest",
           "size": 4702960640,
           "modified": "2024-01-15T10:30:00Z"
         }
       ],
       "totalModels": 1
     }
   }
   ```

3. **List Available Models:**
   ```bash
   curl http://localhost:5000/api/v1/ollama/models
   ```

4. **Test a Specific Model:**
   ```bash
   curl http://localhost:5000/api/v1/ollama/test/llama3
   ```

5. **Chat with Ollama:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/chat-with-ollama \
     -H "Content-Type: application/json" \
     -d '{
       "prompt": "Explain quantum computing in simple terms",
       "model": "llama3"
     }'
   ```

### Method 2: Direct Ollama CLI Test

```bash
# Test model directly
ollama run llama3 "What is artificial intelligence?"
```

## API Endpoints

### GET `/api/v1/ollama/status`

Check if Ollama server is running and list available models.

**Response:**
```json
{
  "success": true,
  "message": "Ollama is running and accessible",
  "data": {
    "status": "online",
    "host": "http://localhost:11434",
    "models": [...],
    "totalModels": 3
  }
}
```

### GET `/api/v1/ollama/models`

List all installed Ollama models.

**Response:**
```json
{
  "success": true,
  "message": "Models retrieved successfully",
  "data": {
    "models": ["llama3:latest", "mistral:latest"],
    "count": 2
  }
}
```

### GET `/api/v1/ollama/test/:model`

Test if a specific model is working correctly.

**Example:**
```bash
curl http://localhost:5000/api/v1/ollama/test/llama3
```

**Response:**
```json
{
  "success": true,
  "message": "Model 'llama3' is working correctly",
  "data": {
    "model": "llama3",
    "testPrompt": "Say hello in one sentence",
    "response": "Hello! I'm an AI assistant.",
    "latency": "< 1s"
  }
}
```

### POST `/api/v1/chat-with-ollama`

Chat with an Ollama model.

**Request:**
```json
{
  "prompt": "Your question here",
  "model": "llama3"
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": "Detailed AI response..."
}
```

## Troubleshooting

### Issue: "Ollama server is not running"

**Solution:**
```bash
# Start the Ollama server
ollama serve

# In a new terminal, test connection
curl http://localhost:11434/api/tags
```

### Issue: "Model 'llama3' is not installed"

**Solution:**
```bash
# Pull the missing model
ollama pull llama3

# Verify installation
ollama list
```

### Issue: "Connection refused" or "ECONNREFUSED"

**Possible causes:**
1. Ollama service not running → Run `ollama serve`
2. Wrong port → Check `OLLAMA_HOST` in `.env`
3. Firewall blocking port 11434 → Allow access

### Issue: Model runs but responses are slow

**Solutions:**
- Close unnecessary applications to free RAM
- Use a smaller model (e.g., `phi` instead of `llama3`)
- Upgrade to a machine with more RAM
- Use GPU acceleration if available

### Issue: "Out of memory" error

**Solution:**
```bash
# Remove unused models to free space
ollama rm mistral

# Use a smaller model
ollama pull phi
```

## Model Recommendations

| Model     | Size   | RAM Needed | Best For                |
|-----------|--------|------------|-------------------------|
| **llama3**| ~4.7GB | 8GB+       | General chat, reasoning |
| **mistral**| ~4.1GB | 8GB+       | Fast responses          |
| **phi**   | ~1.6GB | 4GB+       | Edge devices, quick     |
| **gemma** | ~2.6GB | 6GB+       | Balanced performance    |

## Advanced Configuration

### Custom Ollama Host

If running Ollama on a different machine or port:

```dotenv
# .env
OLLAMA_HOST=http://192.168.1.100:11434
```

### Using Docker for Ollama

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker exec -it ollama ollama pull llama3
```

### Environment-Specific Configuration

**Development:**
```dotenv
OLLAMA_HOST=http://localhost:11434
OLLAMA_DEFAULT_MODEL=phi  # Lightweight for dev
```

**Production:**
```dotenv
OLLAMA_HOST=http://ollama-service:11434
OLLAMA_DEFAULT_MODEL=llama3  # More powerful
```

## Performance Tips

1. **Pre-load models** to avoid first-request delays:
   ```bash
   ollama run llama3 "warmup" > /dev/null
   ```

2. **Keep Ollama running** as a background service instead of starting/stopping

3. **Monitor resource usage:**
   ```bash
   # Linux/macOS
   top -p $(pgrep ollama)
   
   # Windows
   Task Manager → Ollama
   ```

4. **Use smaller models** for faster responses if accuracy isn't critical

## Additional Resources

- **Official Docs:** https://ollama.com/docs
- **Model Library:** https://ollama.com/library
- **GitHub:** https://github.com/ollama/ollama
- **Community Discord:** https://discord.gg/ollama

## Integration Code Reference

The Ollama integration consists of:

- **Controller:** `LocalMind-Backend/src/api/v1/Ai-model/Ollama/Ollama.controller.ts`
- **Service:** `LocalMind-Backend/src/api/v1/Ai-model/Ollama/Ollama.service.ts`
- **Utils:** `LocalMind-Backend/src/api/v1/Ai-model/Ollama/Ollama.utils.ts`
- **Routes:** `LocalMind-Backend/src/api/v1/Ai-model/Ollama/Ollama.routes.ts`

All configurations use environment variables from `.env`, ensuring no hardcoded URLs or model names.

---

**Need help?** Open an issue on [GitHub](https://github.com/NexGenStudioDev/LocalMind/issues) with the `ollama` label.
