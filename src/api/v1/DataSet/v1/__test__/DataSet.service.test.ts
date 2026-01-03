import DataSetService from '../DataSet.service'
import GeminiUtils from '../../Ai-model/Google/Google.utils'

jest.mock('../../Ai-model/Google/Google.utils')

describe('DataSetService', () => {
  afterEach(() => jest.restoreAllMocks())

  test('Prepare_DataSet awaits generateResponse and returns result', async () => {
    const expected = { ok: true }
    ;(GeminiUtils as any).mockImplementation(() => ({
      generateResponse: jest.fn().mockResolvedValue(expected),
    }))

    const res = await DataSetService.Prepare_DataSet('input')
    expect(res).toEqual(expected)
  })
})
