import { Router } from 'express'
const router: Router = Router()

import userController from './user.controller'
import userMiddleware from './user.middleware'

router.post('/v1/auth/signup', userController.register)
router.post('/v1/user/login', userController.login)


router.get('/v1/auth/apiKey/generate', userMiddleware.middleware, userController.apiEndPointCreater)
router.get('/v1/auth/profile', userMiddleware.middleware, userController.profile)
router.get('/v1/auth/apiKey', userMiddleware.middleware, userController.getApiKey)

// router.post("v1/user/apikey/reveal",   userMiddleware.middleware, UserController.revealApiKey);

export { router as userRoutes }
