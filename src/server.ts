import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import path from 'path'
import 'dotenv'

import './database/connection'

import errorHandler from './errors/handler'


import routes from './routes/routes'
import authRoutes from './routes/authRoutes'


const app = express()
app.use(cors())
app.use(express.json())
app.use('/', routes)
app.use('/admin',authRoutes)
app.use('/uploads', express.static(path.join(__dirname,'..','uploads')))
app.use(errorHandler)

app.listen(process.env.PORT || 3333)