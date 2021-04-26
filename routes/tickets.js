const express = require('express')
const Ticket = require('../models/Ticket')
const {
    getAllTickets,
    getTicket,
    updateTicket,
    createTicket
} = require('../controllers/tickets')
const notesRouter = require('./notes')
const advResults = require('../middleware/advResults')

const router = express.Router({ mergeParams: true })

router.use('/:ticketId/notes', notesRouter)


router
    .route('/')
    .get(advResults(Ticket), getAllTickets)
    .post(createTicket)

router
    .route('/:id')
    .get(getTicket)
    .put(updateTicket)

module.exports = router