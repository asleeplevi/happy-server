import {Router} from 'express'
import multer from 'multer'

import UploadConfig from '../config/upload'
import OrphanagesController from '../controllers/OrphanagesController'
import UsersController from '../controllers/UsersController'


const routes = Router()
const upload = multer(UploadConfig)

routes.get('/orphanages',  OrphanagesController.index)
routes.get('/orphanages/:id',  OrphanagesController.show)
routes.post('/orphanages',  upload.array('images'),OrphanagesController.create)

routes.post('/user', UsersController.create)
routes.post('/user/authenticate', UsersController.authenticate)
routes.post('/user/forgot_password', UsersController.forgotPassword)
routes.post('/user/reset_password', UsersController.resetPassword)

export default routes