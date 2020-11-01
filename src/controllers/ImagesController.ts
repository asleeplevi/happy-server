import { unlink } from 'fs'
import { getRepository } from 'typeorm'

import path from 'path'

import Image from '../models/Image'

export default {
    async DeleteImage(images: any){
        

        if(!Array.isArray(images)){
            const { id, url } = JSON.parse(images)

            const imageRepository =  getRepository(Image)

            const findImage = await imageRepository.findOne({id})
        
            if(findImage){
                await imageRepository.delete(findImage)
            }

            const basePath = path.join(__dirname,'..','..','uploads')

            const name = url.split('/').pop()

            unlink(`${basePath}/${name}`, err => {
                console.log(err)
            })
            return 0
        }

        images.forEach( async function(image:any ) {
            const { id, url } = JSON.parse(image)
            
            const name = url.split('/').pop()
            
            const imageRepository =  getRepository(Image)

            const findImage = await imageRepository.findOne({id})

            if(findImage){
                await imageRepository.delete(findImage)
            }

            const basePath = path.join(__dirname,'..','..','uploads')

            unlink(`${basePath}/${name}`, err => {
                console.log(err)
            })
        })
    }
}