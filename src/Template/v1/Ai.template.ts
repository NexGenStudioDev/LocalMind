import fs from 'fs/promises'
import path from 'path'
import { PromptTemplate } from '@langchain/core/prompts'

export type LangchainPromptTemplate = PromptTemplate

class AiTemplate {
  async getPromptTemplate(): Promise<LangchainPromptTemplate> {
    const templatePath = path.resolve('./src/Template/v1/text/PromptText.txt')
    let promptText = await fs.readFile(templatePath, 'utf-8')
    // Escape all single { and } that are not variable placeholders
    // Replace all { with {{ and } with }} except for {userName} and {userPrompt}
    promptText = promptText
      .replace(/({)(?!userName\}|userPrompt\})/g, '{{')
      .replace(/(?<!\{userName|userPrompt)(})/g, '}}')

    const prompt = PromptTemplate.fromTemplate(promptText)

    return prompt
  }
}

export default new AiTemplate()
