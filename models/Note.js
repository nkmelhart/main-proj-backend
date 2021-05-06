const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    note: {
        type: String,
        minlength: [5, 'Note must be at least 5 characters long'],
        maxlength: [5000, 'Note cannot be more than 5000 characters'],
        required: [true, 'Please enter a ticket note'],
    },
    enteredBy: {
        type: String,
        required: [true, 'Please enter user entered by.']
    },
    ticket: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ticket',
        required: true
    },
    // client: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Client',
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model("Note", NoteSchema)