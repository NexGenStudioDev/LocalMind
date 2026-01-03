import { Router } from 'express'
import DataSetController from './DataSet.controller'
const router: Router = Router()

router.get('/upload', DataSetController.uploadDataSet)

export { router as DataSetRoutes }
