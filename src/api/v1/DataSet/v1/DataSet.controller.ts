import { Request, Response } from 'express'

import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import path from 'path'
import { SendResponse } from '../../../../utils/SendResponse.utils'
import DataSetService from './DataSet.service'
import { safeParse } from '../../../../utils/safeJson.util'

class DataSetController {
  public async uploadDataSet(req: Request, res: Response): Promise<void> {
    try {
      const filePath = path.join(path.resolve(), 'src', 'data', 'Sample.csv')

      const loader = new CSVLoader(filePath)
      const documents = await loader.load()

      const Prepare_dataSet = await DataSetService.Prepare_DataSet(documents)

      const parsed = typeof Prepare_dataSet === 'string' ? safeParse(Prepare_dataSet, Prepare_dataSet) : Prepare_dataSet

      SendResponse.success(
        res,
        'Dataset uploaded and processed successfully',
        parsed
      )
    } catch (error: any) {
      SendResponse.error(res, 'Failed to upload dataset', 500, error)
    }
  }
}

export default new DataSetController()
