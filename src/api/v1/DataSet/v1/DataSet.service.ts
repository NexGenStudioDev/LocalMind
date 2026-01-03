import GeminiUtils from '../../Ai-model/Google/Google.utils'
import DataSetUtils from './DataSet.utils'

class DataSet_Service {
  async Prepare_DataSet(Data: any): Promise<any> {
    try {
      const geminiUtils = new GeminiUtils({
        modelName: 'gemini-1.5-flash',
        maxOutputTokens: 1000,
        temperature: 0.7,
      })

      const promptTemplate = await DataSetUtils.Prepare_PromptTemplate()

      // debug: prompt template loaded

      const Extract_Data = geminiUtils.generateResponse(promptTemplate, {
        userName: 'Alice',
        userPrompt: Data,
      })

      return Extract_Data
    } catch (error) {
      console.error('Error in Prepare_DataSet:', error)
      return null
    }
  }
}

export default new DataSet_Service()
