import * as fs from 'fs'
import * as path from 'path'
import { PromptTemplate } from '@langchain/core/prompts'

class DatasetUtils {
  async Prepare_PromptTemplate(): Promise<any> {
    try {
      const path_to_prompt = path.resolve(
        './src/api/DataSet/v1/Prompt/question_answer_extractor_prompt.txt'
      )

      let promptText = await fs.readFileSync(path_to_prompt, 'utf-8')

      // Escape all single { and } that are not variable placeholders
      // Replace all { with {{ and } with }} except for {userName} and {userPrompt}
      promptText = promptText
        .replace(/({)(?!userName\}|userPrompt\})/g, '{{')
        .replace(/(?<!\{userName|userPrompt)(})/g, '}}')

      const Prompt = PromptTemplate.fromTemplate(promptText)

      return Prompt
    } catch (error) {
      console.error('Error in Prepate_Prompt:', error)
      throw error
    }
  }
}

export default new DatasetUtils()
