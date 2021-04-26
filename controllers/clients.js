const Client = require('../models/Client')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const logger = require('consola')

exports.getClients = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advResults)
})

exports.getClient = asyncHandler(async (req, res, next) => {
    const client = await Client.findById(req.params.id)

    if(!client){
        return next(new ErrorResponse(`Client not found with if ${req.params.id}`, 404))
    }

    res.status(200).json({ success: true, data: client})
})

exports.createClient = asyncHandler(async (req, res, next) => {
    const client = await Client.create(req.body)

    res.status(201).json({ success: true, data: client})
})

exports.updateClient = asyncHandler(async (req, res, next) => {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true
        })

    if(!client){
        return next(new ErrorResponse(`Client not found with id ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: client})
})

exports.deleteClient = asyncHandler(async (req, res, next) => {
    const client = await Client.findByIdAndDelete(req.params.id)

    if(!client) {
        return next( new ErrorResponse(`Client not found with id of ${req.params.id}`))
    }

    res.status(200).json({ success: true, data: {} })
})

// exports.deleteAllClient = asyncHandler(async (req, res, next) => {
//     const client = await Client.findByIdAndDelete()

//     res.status(200).json({ success: true, data: {} })
// })