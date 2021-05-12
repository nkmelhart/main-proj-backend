const express = require('express')
const Ticket = require('../models/Ticket')
const {
    getAllTickets,
    getTicket,
    updateTicket,
    createTicket,
    getTicketCreateData,
    getTicketSearchTerm,
    getTicketSearchUser,
    getTicketSearchClient,
} = require('../controllers/tickets')
const notesRouter = require('./notes')
const advResults = require('../middleware/advResults')

const router = express.Router({ mergeParams: true })

router.use('/:ticketId/notes', notesRouter)


router
    .route('/')
    .get(advResults(Ticket, [{
        path: 'client',
        select: 'name poc pocEmail phone'
    },
    {
        path: 'assignTo',
        select: 'name'
    }],
    ), getAllTickets)
    .post(createTicket)

router
    .route('/getCreateData')
    .get(getTicketCreateData)
    
router
    .route('/:id')
    .get(getTicket)
    .put(updateTicket)

router
    .route('/searchterm/:searchTerm')
    .get(getTicketSearchTerm)

router
    .route('/user/:searchUser')
    .get(getTicketSearchUser)

router
    .route('/searchclient/:searchClient')
    .get(getTicketSearchClient)
module.exports = router