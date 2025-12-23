import { Router } from 'express'
const router: Router = Router()

import userController from './user.controller'
import userMiddleware from './user.middleware'

router.post('/v1/user/register', userController.register)

router.post('/v1/auth/signup', userController.register)

router.post('/v1/user/login', userController.login)
router.post('/v1/auth/login', userController.login)

router.get('/v1/user/apiKey/generate', userMiddleware.middleware, userController.apiEndPointCreater)

router.get('/v1/user/profile', userMiddleware.middleware, userController.profile)
router.get('/v1/user/apiKey', userMiddleware.middleware, userController.getApiKey)

// router.post("v1/user/apikey/reveal",   userMiddleware.middleware, UserController.revealApiKey);

export { router as userRoutes }
