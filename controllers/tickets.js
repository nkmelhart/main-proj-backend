const Ticket = require('../models/Ticket')
const Client = require('../models/Client')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const logger = require('consola')

//@desc     Get courses
//@route    GET /api/v1/tickets
//@route    GET /api/v1/clients/:clientId/tickets
//access    Public
exports.getAllTickets = asyncHandler(async (req, res, next) => {

    if (req.params.clientId) {
        console.log(req.params.clientId)
        const client = await Client.findById(req.params.clientId)

        if (!client) {
            return next( new ErrorResponse(`No client with ID of ${req.params.clientId}`, 404))
        }
        const tickets = await Ticket.find({ client: req.params.clientId })
        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        })
    }
    else {
        res.status(200).json(res.advResults)
    }
})

//@desc     Get courses
//@route    GET /api/v1/tickets/:id
//access    Public

exports.getTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: ticket
    })
})

//@desc     Add course
//@route    POST /api/v1/client/:clientId/tickets
//access    Public

exports.createTicket = asyncHandler(async (req, res, next) => {
    req.body.client = req.params.clientId
    const client = Client.findById(req.params.clientId)
    if (!client) {
        return next( new ErrorResponse(`No client found with ID of ${req.params.clientId}`))
    }
    const ticket = await Ticket.create(req.body)
    res.status(200).json({
        success: true,
        data: ticket
    })
})

exports.updateTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!ticket) {
        return next(new ErrorResponse(`Ticket not found with ID of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: ticket
    })
})