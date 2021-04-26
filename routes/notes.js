const express = require('express')
const {
    getNotesByTicketId,
    createNote
} = require('../controllers/notes')

const router = express.Router({ mergeParams: true})

router
    .route('/')
    .get(getNotesByTicketId)
    .post(createNote)

module.exports = router
