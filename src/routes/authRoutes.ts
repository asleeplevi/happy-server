import authMiddleware from '../middlewares/auth'
import OrphanagesController from '../controllers/OrphanagesController'
import UploadConfig from '../config/upload'
import multer from 'multer'


import {Request, Response, Router} from 'express'

const upload = multer(UploadConfig)


const authRoutes = Router()

authRoutes.use(authMiddleware)

authRoutes.get('/', (request:any, response: Response)=>{
    response.json({a: request.userID})
})

authRoutes.get('/orphanages/pending',  OrphanagesController.indexPending)
authRoutes.put('/orphanage/change/', upload.array('images'), OrphanagesController.changeFields)
authRoutes.delete('/orphanages/:id',OrphanagesController.delete)


export default authRoutes