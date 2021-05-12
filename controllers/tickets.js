const Ticket = require('../models/Ticket')
const Client = require('../models/Client')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const logger = require('consola')

//@desc     Get tickets
//@route    GET /api/v1/tickets
//@route    GET /api/v1/clients/:clientId/tickets
//access    Public
exports.getAllTickets = asyncHandler(async (req, res, next) => {

    if (req.params.clientId) {
        let client = null

        console.log(req.query.active, req.params.clientId)

        if (Object.keys(req.query).length === 0) {
            client = await Client.findById(req.params.clientId)
        }
        else {
            console.log("here ", req.query.active.toString(), req.params.clientId)
            client = await Client.find({ active: req.query.active.toString(), client: req.params.clientId })
        }
        

        console.log(req.query)

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

//@desc     Get tickets
//@route    GET /api/v1/tickets/:id
//access    Public

exports.getTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id).populate({
        path: 'client',
        select: 'name poc pocEmail phone'
    }).populate({
        path: 'assignTo',
        select: 'name email'
    })
    if (!ticket) {
        return next(new ErrorResponse(`No ticket with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: ticket
    })
})

exports.getTicketSearchTerm = asyncHandler(async (req, res, next) => {

    let searchTerm = req.params.searchTerm
    searchTerm = searchTerm.replace('+', ' ')
    const activeBool = req.query.active.toString()
    const tickets = await Ticket.find({ active: activeBool, $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }] })
    
        .populate({
            path: 'client',
            select: 'name poc pocEmail phone'
        }).populate({
            path: 'assignTo',
            select: 'name email'
        })

    if (!tickets) {
        return next(new ErrorResponse(`No ticket with search term of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
    })
})

exports.getTicketSearchUser = asyncHandler(async (req, res, next) => {

    let searchUser = req.params.searchUser
    searchUser = searchUser.replace('+', ' ')
    console.log(searchUser)
    const activeBool = req.query.active.toString()
    const tickets = await Ticket.find({ active: activeBool, assignTo: searchUser} ).populate({
        path: 'client',
        select: 'name poc pocEmail phone'
    }).populate({
            path: 'assignTo',
            select: 'name email'
        })

    if (!tickets) {
        return next(new ErrorResponse(`No ticket with search term of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
    })
})

exports.getTicketSearchClient = asyncHandler(async (req, res, next) => {

    let searchClient = req.params.searchClient
    let clientIdArray = []
    let activeBool = true

    searchClient = searchClient.replace('+', ' ')
    if (req.query.active) {
       activeBool = req.query.active.toString()
    }
    const clients = await Client.find({ name: { $regex: searchClient, $options: 'i' } })
    
    clients.forEach(element => {
        clientIdArray.push(element._id)
    })
    const tickets = await Ticket.find({ active: activeBool, client: { $in: clientIdArray } }).populate({
        path: 'client',
        select: 'name poc pocEmail phone'
    }).populate({
            path: 'assignTo',
            select: 'name email'
        })

    if (!tickets) {
        return next(new ErrorResponse(`No ticket with search term of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
    })
})

//@desc     Get tickets create data
//@route    GET /api/v1/tickets/getCreateData
//access    Public

exports.getTicketCreateData = asyncHandler(async (req, res, next) => {
    const users = await User.find().sort("name")
    const clients = await Client.find().sort("name")

    if (!users) {
        return next(new ErrorResponse('No users found', 404))
    }
    if (!clients) {
        return next(new ErrorResponse('No clients found', 404))
    }

    res.status(200).json({
        success: true,
        clients: clients,
        users: users,
        data: {}
    })
})

//@desc     Add tickets
//@route    POST /api/v1/client/:clientId/tickets
//access    Public

exports.createTicket = asyncHandler(async (req, res, next) => {
    req.body.client = req.params.clientId
    const client = Client.findById(req.params.clientId)
    if (!client) {
        return next(new ErrorResponse(`No client found with ID of ${req.params.clientId}`))
        
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