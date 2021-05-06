const express = require('express')
const Client = require('../models/Client')

const {
    getClient,
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientBySearch
    // deleteAllClient

} = require('../controllers/clients')

const advResults = require('../middleware/advResults')

const ticketsRouter = require('./tickets')

const router = express.Router()

router.use('/:clientId/tickets', ticketsRouter)

router
    .route('/')
    .get(advResults(Client), getClients)
    .post(createClient)
    // .delete(deleteAllClient)

router
    .route('/:id')
    .get(getClient)
    .put(updateClient)
    .delete(deleteClient)

router
    .route('/search/:searchTerm')
    .get(getClientBySearch)

module.exports = router