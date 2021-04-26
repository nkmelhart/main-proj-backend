const fs = require('fs')
const mongoose = require('mongoose')
const logger = require('consola')
const dotenv = require('dotenv')

//Load dotenv config

dotenv.config({ path: './config/config.env' })

//Load models

const Client = require('./models/Client')
const Ticket = require('./models/Ticket')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    
const clients = JSON.parse(fs.readFileSync(`${__dirname}/_data/clients.json`))
const tickets = JSON.parse(fs.readFileSync(`${__dirname}/_data/tickets.json`))

const importData = async () => {
    try {
        await Client.create(clients)
        await Ticket.create(tickets)
        logger.info('Data imported...')
        process.exit()
    }
    catch (err) {
        logger.error(err)
    }
}

const deleteData = async () => {
    try {
        await Client.deleteMany()
        await Ticket.deleteMany()
        logger.info('Data deleted...')
        process.exit()
    }
    catch (err) {
        logger.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData()
}
else if (process.argv[2] === '-d') {
    deleteData()
}
else {
    logger.error('Argument invalid or missing.')
    process.exit()
}