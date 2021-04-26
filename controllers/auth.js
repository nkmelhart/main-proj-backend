const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const jwt = require('jsonwebtoken')

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, role, password } = req.body
    
    const user = await User.create({
        name,
        email,
        role,
        password
    })

    sendTokenResponse(user, 200, res)
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