const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a username'],
        minlength: [3, 'Username must be longer than 3 characters'],
        maxlength: [100, 'Username must be less than 100 characters'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter a user email.'],
        minlength: [5, 'Email must be at least 5 characters'],
        maxlength: [100, 'Email must be less than 100 characters'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]

    },
    phone: {
        type: String,
        minlength: [10, 'Phone number must be at least 10 characters'],
        maxlength: [20, "Phone number must be less than 20 characters"]
    },
    notes: {
        type: String,
        maxlength: [4000, "Note must be less than 4000 characters"]
    },
    role: {
        type: String,
        enum: {
            values: [
            'tech',
            'admin'
            ],
            message: 'Role is either not selected or invalid'
        },
        default: 'tech'
    },
    password: {
        type: String,
        requires: [true, 'Please enter a password'],
        minlength: 8,
        match: [
            /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/, 'Password must have one upper case character, one lower case character, one special character, and must be at least 8 characters long'
        ],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: String,
        default: Date.now
    }
})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwt = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)