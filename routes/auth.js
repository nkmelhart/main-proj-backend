const router = require('express').Router()
const { register, login, getUsers, updateUser, getSearchUserData, getUser } = require('../controllers/auth')
const advResults = require('../middleware/advResults')
const User = require('../models/User')

router
    .route('/register')
    .post(register)

router
    .route('/users')
    .get(advResults(User), getUsers)

router
    .route('/login')
    .post(login)

router
    .route('/users/:id')
    .put(updateUser)
    .get(getUser)

router
    .route('/users/search/:searchTerm')
    .get(getSearchUserData)


module.exports = router