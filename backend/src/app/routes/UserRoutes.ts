import express from 'express'
import { UserController } from '../controllers/UserController.js'
import { authMiddleware } from '../middleware/auth.middlware.js'

const userRouter = express.Router()
const userController = new UserController()

userRouter.route('/login/:oidcType').get(userController.login)
userRouter.route('/callback/:oidcType').get(userController.callback)
userRouter.route('/updateProfile/:id').put(authMiddleware, userController.updateUser)
userRouter.route('/profile/:id').get(authMiddleware, userController.getProfile)
userRouter.route('/logout').post(authMiddleware, userController.logout)
userRouter.route('/logs').post(authMiddleware, userController.logs)
export default userRouter
