const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please enter a ticket title'],
        minlength: [5, "Ticket title must be at least 5 characters long"],
        maxlength: [100, "Ticket title must be less than 100 characters"]
    },
    description: {
        type: String,
        required: [true, 'Please enter a ticket description'],
        minlength: [5, "Description must be at least 5 characters long"],
        maxlength: [10000, 'Description cannot be more than 10000 characters']
    },
    contactName: {
        type: String,
        required: [true, 'Please enter contact name'],
        minlength: [3, 'Contact name must be longer than 3 characters'],
        maxlength: [100, 'Contact name must be less than 100 characters']

    },
    contactNumber: {
        type: String,
        required: [true, 'Please enter a contact number'],
        maxlength: [20, 'Contact number cannot be longer than 20 characters']
    },
    status: {
        type: String,
        required: [true, 'Status field is required'],
        enum: {
            values: [
                'New',
                'Open',
                'Contact Customer',
                'Scheduled',
                'Ongoing',
                'Code Yellow',
                'Code Red',
                'Waiting on Parts',
                'Waiting on Customer',
                'Waiting on Vendor',
                'On Hold',
                'Closed'
            ],
            message: 'Status is either not selected or invalid'
        },
        default: 'New'
    },
    assignTo: {
        type: String,
        default: 'None'
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
        required: true
    }
})


//This is broken. Need to fix it
TicketSchema.pre('save', function (next) {
    if (this.status === "Closed") {
        this.active = false
    } 
    next()
})

module.exports = mongoose.model('Ticket', TicketSchema)