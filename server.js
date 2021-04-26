const express = require('express')
const dontenv = require('dotenv')
const morgan = require('morgan')
const logger = require('consola')
const cors = require('cors')
const connectDB = require('./config/db')
const clientsRouter = require('./routes/clients')
const ticketsRouter = require('./routes/tickets')
const authRouter = require('./routes/auth')
const errorHandler = require('./middleware/error')

dontenv.config({path: './config/config.env'})

connectDB()

const app = express()
app.use(express.json())
app.use(cors({origin: process.env.ORIGIN}))

app.use(morgan('dev'))

app.use('/api/v1/clients', clientsRouter)
app.use('/api/v1/tickets', ticketsRouter)
app.use('/api/v1/auth', authRouter)

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, logger.success(`Server started on port ${PORT}`))