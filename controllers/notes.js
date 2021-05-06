const Note = require('../models/Note')
const Ticket = require('../models/Ticket')
const Client = require('../models/Client')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc     Get notes by ticketID
//@route    GET /api/v1/tickets/:ticketId/notes
exports.getNotesByTicketId = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.ticketId)

    if (!ticket) {
        return next( new ErrorResponse(`No ticket with ID of ${req.params.ticketId}`, 404))
    }

    const client = await Client.findById(ticket.client._id)

    const notes = await Note.find({ ticket: req.params.ticketId }).sort('-createdAt')

    console.log('notes length: ', notes.length)
    
    res.status(200).json({
        success: true,
        count: notes.length,
        client: client,
        ticket: ticket,
        data: notes
    })
})

//@desc     Create note by ticketID
//@route    POST /api/v1/tickets/:ticketId/notes
exports.createNote = asyncHandler(async (req, res, next) => {
    req.body.ticket = req.params.ticketId
    const ticket = Ticket.findById(req.params.ticketId)

    if (!ticket) {
        return next( new ErrorResponse(`No ticket with ID of ${req.params.ticketId}`, 404))
    }

    const note = await Note.create(req.body)

    res.status(200).json({
        success: true,
        data: note
    })
})