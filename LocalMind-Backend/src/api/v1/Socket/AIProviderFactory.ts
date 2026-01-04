import { AIProviderConfig, AIConversationContext } from './Socket.types'
import OllamaProvider from '../Ai-model/Ollama/Ollama.service'
import GroqProvider from '../Ai-model/Groq/Groq.service'
// Assuming other providers exist in the codebase

interface AIResponse {
  message: string
  tokensUsed?: number
  model: string
}

interface IAIProvider {
  chat(message: string, context: AIConversationContext): Promise<AIResponse>
}

class OllamaProviderWrapper implements IAIProvider {
  private baseUrl: string
  private model: string

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl || 'http://localhost:11434'
    this.model = model
  }

  async chat(message: string, context: AIConversationContext): Promise<AIResponse> {
    try {
      const recentContext = context.recentMessages
        .map(msg => `${msg.username}: ${msg.message}`)
        .join('\n')

      const prompt = `
Previous conversation:
${recentContext}

User: ${message}

AI: `

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          temperature: context.temperature || 0.7,
        }),
      })

      const data: any = await response.json()

      return {
        message: data.response || 'Unable to generate response',
        model: this.model,
      }
    } catch (error: any) {
      console.error('Ollama error:', error)
      throw new Error(`Ollama API error: ${error.message}`)
    }
  }
}

class GroqProviderWrapper implements IAIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey
    this.model = model
  }

  async chat(message: string, context: AIConversationContext): Promise<AIResponse> {
    try {
      const recentContext = context.recentMessages
        .map(msg => ({ role: msg.userId === '000000000000000000000000' ? 'assistant' : 'user', content: msg.message }))
        .slice(-5)

      // Using Groq SDK (would need import)
      // This is a placeholder for the actual Groq integration
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [...recentContext, { role: 'user', content: message }],
          max_tokens: context.maxTokens || 2000,
          temperature: context.temperature || 0.7,
        }),
      })

      const data: any = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Groq API error')
      }

      return {
        message: data.choices[0]?.message?.content || 'Unable to generate response',
        tokensUsed: data.usage?.total_tokens,
        model: this.model,
      }
    } catch (error: any) {
      console.error('Groq error:', error)
      throw new Error(`Groq API error: ${error.message}`)
    }
  }
}

class OpenAIProviderWrapper implements IAIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey
    this.model = model
  }

  async chat(message: string, context: AIConversationContext): Promise<AIResponse> {
    try {
      const recentContext = context.recentMessages
        .map(msg => ({ role: msg.userId === '000000000000000000000000' ? 'assistant' : 'user', content: msg.message }))
        .slice(-5)

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [...recentContext, { role: 'user', content: message }],
          max_tokens: context.maxTokens || 2000,
          temperature: context.temperature || 0.7,
        }),
      })

      const data: any = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI API error')
      }

      return {
        message: data.choices[0]?.message?.content || 'Unable to generate response',
        tokensUsed: data.usage?.total_tokens,
        model: this.model,
      }
    } catch (error: any) {
      console.error('OpenAI error:', error)
      throw new Error(`OpenAI API error: ${error.message}`)
    }
  }
}

class AnthropicProviderWrapper implements IAIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey
    this.model = model
  }

  async chat(message: string, context: AIConversationContext): Promise<AIResponse> {
    try {
      const recentContext = context.recentMessages
        .filter(msg => msg.userId !== '000000000000000000000000')
        .slice(-5)
        .map(msg => msg.message)
        .join('\n\n')

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: context.maxTokens || 2000,
          messages: [
            {
              role: 'user',
              content: `${recentContext}\n\nUser: ${message}`,
            },
          ],
        }),
      })

      const data: any = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Anthropic API error')
      }

      return {
        message: data.content[0]?.text || 'Unable to generate response',
        model: this.model,
      }
    } catch (error: any) {
      console.error('Anthropic error:', error)
      throw new Error(`Anthropic API error: ${error.message}`)
    }
  }
}

class AIProviderFactory {
  static getProvider(config: AIProviderConfig): IAIProvider {
    switch (config.type) {
      case 'ollama':
        return new OllamaProviderWrapper(config.baseUrl || 'http://localhost:11434', config.model)
      case 'groq':
        if (!config.apiKey) {
          throw new Error('Groq API key required')
        }
        return new GroqProviderWrapper(config.apiKey, config.model)
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key required')
        }
        return new OpenAIProviderWrapper(config.apiKey, config.model)
      case 'anthropic':
        if (!config.apiKey) {
          throw new Error('Anthropic API key required')
        }
        return new AnthropicProviderWrapper(config.apiKey, config.model)
      case 'google':
        // Google provider wrapper would go here
        throw new Error('Google provider not yet implemented')
      default:
        throw new Error(`Unknown AI provider: ${(config as any).type}`)
    }
  }
}

export default AIProviderFactory
