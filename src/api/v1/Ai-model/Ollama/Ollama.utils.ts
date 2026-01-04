import axios from 'axios'
import { env } from '../../../constant/env.constant'

const OLLAMA_BASE = env.OLLAMA_BASE_URL || 'http://localhost:11434'

class OllamaUtils {
  async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      const response = await axios.get(`${OLLAMA_BASE}/api/tags`)

      if (!response.data || !response.data.models || !Array.isArray(response.data.models)) {
        throw new Error('Please start the Ollama server to check model availability')
      }

      const modelExists = response.data.models.some(
        (model: any) => model.name === modelName || model.name.startsWith(`${modelName}:`)
      )

      if (!modelExists) {
        throw new Error(`Model '${modelName}' is not installed. Please install it.`)
      }

      return true
    } catch (error: any) {
      throw new Error(error.message || 'Failed to check model availability')
    }
  }

  async listAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${OLLAMA_BASE}/api/tags`)

      if (!response.data || !response.data.models || !Array.isArray(response.data.models)) {
        throw new Error('Unexpected response format from Ollama API')
      }

      return response.data.models.map((model: any) => model.name)
    } catch (error: any) {
      const e = error as any
      if (e && (e.code === 'ECONNREFUSED' || e.code === 'ECONNRESET')) {
        throw new Error('Could not connect to Ollama server. Is it running?')
      } else {
        throw new Error(`Failed to list available models: ${e?.message || String(e)}`)
      }
    }
  }
}

export default new OllamaUtils()
