import Orphanage from '../models/Orphanage'
import imagesView from './images_view'

export default{
    render(orphanage: Orphanage){
        return{
            id: orphanage.id,
            name: orphanage.name,            
            latitude: Number(orphanage.latitude),
            longitude: Number(orphanage.longitude),
            about: orphanage.about,
            instructions: orphanage.instructions,
            opening_hours: orphanage.opening_hours,
            open_on_weekends: orphanage.open_on_weekends,
            images: imagesView.renderMany(orphanage.images),
            whatsapp: orphanage.whatsapp,
            isActive: orphanage.isActive
        }
    },

    renderMany(orphanages: Orphanage[]){
        const response:Orphanage[] = []
        orphanages.map( orphanage => {
            if(orphanage.isActive){
                response.push(orphanage)
            }
        } )

        return response

    },

    renderPending(orphanages: Orphanage[]){
        const response:Orphanage[] = []
        orphanages.map( orphanage => {
            if(!orphanage.isActive){
                response.push(orphanage)
            }
        } )

        return response
    }

}