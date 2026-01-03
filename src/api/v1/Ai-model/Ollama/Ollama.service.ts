import { OllamaEmbeddings, Ollama } from '@langchain/ollama'
import AiTemplate from '../../../../Template/v1/Ai.template'
import { safeParse } from '../../../../utils/safeJson.util'

class OllamaService {
  public async getVector(data: any): Promise<number[] | undefined> {
    try {
      const embeddings = new OllamaEmbeddings({
        model: 'koill/sentence-transformers:paraphrase-multilingual-minilm-l12-v2',
        maxRetries: 2,
        baseUrl: 'http://localhost:11434',
      })

      const vector = await embeddings.embedDocuments(data)

      return vector[0]
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch embeddings')
    }
  }

  public async generateText(prompt: string, model: string): Promise<string> {
    try {
      const promptTemplate = await AiTemplate.getPromptTemplate()

      const ollama = new Ollama({
        baseUrl: 'http://localhost:11434',
        model: model,
        maxRetries: 2,
        cache: false,
      })

      const formattedPrompt = await promptTemplate.format({
        userName: 'Alice',
        userPrompt: prompt,
      })

      const result = await ollama.invoke(formattedPrompt)

      if (typeof result === 'string') {
        return safeParse(result, result)
      }

      return result
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate text')
    }
  }
}

export default new OllamaService()
