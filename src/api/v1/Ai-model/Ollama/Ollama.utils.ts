import axios from 'axios'
import { getErrorMessage } from '../../../../utils/error.util'

class OllamaUtils {
  async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      const response = await axios.get('http://localhost:11434/api/tags')

      if (!response.data || !response.data.models || !Array.isArray(response.data.models)) {
        throw new Error('Please start the Ollama server to check model availability')
      }

      const modelExists = response.data.models.some(
        (model: any) => model.name === modelName || model.name.startsWith(`${modelName}:`)
      )

      if (!modelExists) {
        throw new Error(`Model '${modelName}' is not install Please install it.`)
      }

      return true
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error) || 'Failed to check model availability')
    }
  }

  async listAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get('http://localhost:11434/api/tags')

      if (!response.data || !response.data.models || !Array.isArray(response.data.models)) {
        throw new Error('Unexpected response format from Ollama API')
      }

      return response.data.models.map((model: any) => model.name)
    } catch (error: unknown) {
      const e = error as any
      if (e && (e.code === 'ECONNREFUSED' || e.code === 'ECONNRESET')) {
        throw new Error('Could not connect to Ollama server. Is it running?')
      } else {
        throw new Error(`Failed to list available models: ${getErrorMessage(error)}`)
      }
    }
  }
}

export default new OllamaUtils()
