const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const jwt = require('jsonwebtoken')

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, role, password, phone, notes } = req.body
    
    const user = await User.create({
        name,
        email,
        role,
        password,
        phone,
        notes
    })

    sendTokenResponse(user, 200, res)
})

exports.updateUser = asyncHandler(async (req, res, next) => {
    const { name, email, role, phone, notes } = req.body

    console.log(req.body)
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true
        })

    //sendTokenResponse(user, 200, res)

    if(!User){
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: user})
})

exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advResults)
})

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next( new ErrorResponse('Please provide email and password', 400))
    }

    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
        return next( new ErrorResponse('Invalid credentials.', 401))
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        console.log('here2')
        return next( new ErrorResponse('Invalid credentials.', 401))
    }

    sendTokenResponse(user, 200, res)

})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwt()

    const options = {
        expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE + 24 * 60 * 60 * 1000)
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

exports.getSearchUserData = asyncHandler(async (req, res, next) => {

    let searchTerm = req.params.searchTerm
    const user = await User.find({ name: { $regex: searchTerm, $options: 'i' } })
    
    if (!user) {
        return next(new ErrorResponse(`No user with search term of ${searchTerm}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

exports.getUser = asyncHandler(async (req, res, next) => {
    let userId = req.params.id

    const user = await User.findById(userId)

    if (!user) {
        return next(new ErrorResponse(`No user with ID of ${userId}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})