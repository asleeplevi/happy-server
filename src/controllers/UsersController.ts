import { Request, Response} from 'express'
import { getRepository } from 'typeorm'
import crypto from 'crypto'

import bcrypt  from  'bcrypt'

import { send , setApiKey} from '@sendgrid/mail'

import userView from '../views/user_view'

import * as Yup from 'yup'

import User, { compareHash, generateToken } from '../models/User'

export default {
    async create(request: Request, response: Response){
        const { name, email, password } = request.body
        
        const userRepository = getRepository(User)

        const data = {
            name, 
            email, 
            password
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required()

        })

        await schema.validate(data, {
            abortEarly: false
        })

        const user = userRepository.create(data)

        await userRepository.save(user)

        return response.status(201).json(user)
    },
    async authenticate(request: Request, response: Response){
        const { email, password } = request.body

        const userRepository = getRepository(User)

        const user = await userRepository.findOne({email})

        if(!user)
            return response.status(404).json({message: "User not found"})
        
        const isPasswordMatch = await compareHash(user, password)

        if(!isPasswordMatch)
            return response.status(400).json({message: "Invalid password"})

        return response.json({user: userView.render(user), token: await generateToken(user.id)})
    },

    async forgotPassword(request: Request, response: Response){

        const { email } = request.body

        const userRepository = getRepository(User)

        const user = await userRepository.findOne({email})
        
        if(!user)
            return response.status(404).json({message: "user not found"})
        
        
            
        const token = crypto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setHours(now.getHours() + 1 )

        const newUserData = {...user, passwordResetToken: token, passwordResetExpires: now   }
            
        const newUser = userRepository.create(newUserData)
            
        await userRepository.save(newUser)
            
        const key = process.env.SENDGRID_KEY

        setApiKey(''+key)

        const msg = {
            to: user.email,
            from: 'jlevi900@gmail.com',
            subject: 'Recupere a sua senha clicando no link abaixo',
            html: `Se você solicitou uma nova senha <a href="http://localhost:3000/resetPassword/${email}&${token}">Clique Aqui</a>`
        }

        send(msg)
        .then(()=> console.log('email sent'))
        .catch(err => console.log(err))

        return response.json({message: "Email enviado!"})
        

    },
   
    async resetPassword(request: Request, response: Response){
        const { email, token, password } = request.body

        const userRepository = getRepository(User)

        const user = await userRepository.findOne({email})


        if(!user)
            return response.status(404).json({error: "user not found"})

        if(user.passwordResetToken != token){
            return response.status(400).json({error: "invalid token"})
        }

        const now = new Date()
        console.log(token)

        if(now > user.passwordResetExpires)
            return response.status(400).json({error: "expired token"})

        const hash = await bcrypt.hash(password, 10)

        const userData = {...user,  password: hash}

        const newUser = userRepository.create(userData)

        await userRepository.save(newUser)


        return response.json({message: "Senha alterada com sucesso!", newUser})

    }
}

