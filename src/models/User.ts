import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert } from 'typeorm'
import jwt from 'jsonwebtoken'  

import * as authConfig from '../config/auth.json'

import bcrypt  from  'bcrypt'

@Entity('users')
export default class User{
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    passwordResetToken: string
    
    @Column()
    passwordResetExpires: Date

    @BeforeInsert()
    private async encryptPassowrd(){
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }

    @CreateDateColumn()
    createdAt:  Date

    


}

export async function compareHash(user: User, password: string){

    const isValidHash = await bcrypt.compare(password, user.password)
    return isValidHash
}

export async function generateToken(id: number){
    const token = jwt.sign({id}, authConfig.secret,{
        expiresIn: 86400
    })

    return token
}

