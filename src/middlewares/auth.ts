import jwt from 'jsonwebtoken'
import * as authConfig from '../config/auth.json'

import {Request, Response, NextFunction} from 'express'

interface newRequest extends Request{
    userID: number
}

export default (request:any, response:Response, next:NextFunction) => {
    const authHeader = request.headers.authorization

    if(!authHeader)
        return response.status(401).json({message: 'No token provided'})

    const parts:string[] = authHeader.split(' ')

    if(parts.length  !== 2)
        return response.status(401).json({message: 'Invalid malformed'})

    const [ scheme, token ] = parts

    jwt.verify(token, authConfig.secret, (err, decoded: any)=> {
        if(err) return response.status(401).json({message: 'Invalid token'})

        request.userID = decoded.id
        next()
    })
    
}