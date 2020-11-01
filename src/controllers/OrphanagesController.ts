import { json, Request, Response} from 'express'
import { getRepository } from 'typeorm'
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'


import Orphanage from '../models/Orphanage'
import Image from '../models/Image'
import ImageController from './ImagesController'

export default{
    async index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage)

        const orphanages = await orphanagesRepository.find({relations: ['images']})
        
        return response.json(orphanageView.renderMany(orphanages))
    },
    async indexPending(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage)

        const orphanages = await orphanagesRepository.find({relations: ['images']})
        
        return response.json(orphanageView.renderPending(orphanages))
    },
    async show(request: Request, response: Response){
        const {id} = request.params

        const orphanagesRepository = getRepository(Orphanage)

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        })
        
        return response.json(orphanageView.render(orphanage))
    },

    async create(request: Request, response: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            isActive,
            whatsapp
        } = request.body
    
        const orphanagesRepository = getRepository(Orphanage)
    
        const requestImages = request.files as Express.Multer.File[]

        const images = requestImages.map(image =>{
            return {path: image.filename}
        })


        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images,
            isActive: isActive === 'true',
            whatsapp
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            isActive: Yup.boolean().required(),
            whatsapp: Yup.number().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        })


        await schema.validate(data, {
            abortEarly: false
        })

        const orphanage = orphanagesRepository.create(data)
    
        await orphanagesRepository.save(orphanage)
    
        return response.status(201).json(orphanage)
    },
    
    async changeFields(request: Request, response: Response){
        const {id, ...rest} = request.body

        const orphanagesRepository = getRepository(Orphanage)
        const imagesRepository = getRepository(Image)

        const findOrphanage = await orphanagesRepository.findOne(id)

        const requestImages = request.files as Express.Multer.File[]

        
        const images = requestImages.map(image =>{
                return { path: image.filename, orphanage: id }
            })


        if(findOrphanage){


            const data = {...findOrphanage, ...rest}

            if(rest.image_to_delete){
                await ImageController.DeleteImage(rest.image_to_delete)
            }

            if(findOrphanage.isActive === false){
                data.isActive = true
            }

            if(data.open_on_weekends){
                data.open_on_weekends = (data.open_on_weekends == 'true') ? true: false 
            }

            const schema = Yup.object().shape({
                name: Yup.string(),
                latitude: Yup.number(),
                longitude: Yup.number(),
                about: Yup.string().max(300),
                instructions: Yup.string(),
                opening_hours: Yup.string(),
                open_on_weekends: Yup.boolean(),
                whatsapp: Yup.number(), 
            })
    
            await schema.validate(data, {
                abortEarly: false
            })

            
            if(images){
                const newImages = await imagesRepository.create(images)
                await imagesRepository.save(newImages)
            }
            
            const newOrphanage = await orphanagesRepository.create(data)

            await orphanagesRepository.save(newOrphanage)
            
            
            return response.json(newOrphanage)
        }
        return response.status(404).json({message: "Orphanage not found"})
    }
    ,
    async delete(request: Request, response: Response){
        const {id} = request.params

        const orphanagesRepository = getRepository(Orphanage)

        const findOrphanage = await orphanagesRepository.findOne(id, {
            relations: ['images']
        })

        if(findOrphanage){
            
                const deleteResult = await orphanagesRepository.remove(findOrphanage)
                const images = findOrphanage?.images
                const formatedImages:any =[] 
                
                images.forEach(item => {
                    const newItem = {id: item.id, url: item.path }
                    formatedImages.push(JSON.stringify(newItem))
                })
                await ImageController.DeleteImage(formatedImages)
            return response.json({message: "Orphanage Deleted", deleteResult})
        }
        return response.status(404).json({message: "Orphanage not found"})

    }
}