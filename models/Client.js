const mongoose = require('mongoose')
const slugify = require('slugify')

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Please enter a client name'],
        unique: true,
        trim: true,
        minlength: [3, 'Client name must be longer than 3 characters'],
        maxlength: [50, 'Client name must be longer than']
    },
    slug: String,
    poc: {
        type: String,
        required: [ true, 'Please enter a point of contact'],
        maxlength: [50, 'POC name cannot be more that 50 characters']
    },
    pocEmail: {
        type: String,
        required: [ true, 'Please enter a point of contact email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ],
        minlength: [5, 'Email must be longer than 5 characters'],
        maxlength: [100, 'Email cannot be longer than 100 characters']
    },
    phone: {
        type: String,
        required: [ true, 'Please enter a phone number'],
        maxlength: [ 20, 'Phone number cannot be longer than 20 characters']
    },
    address : {
        type: String,
        unique: true,
        required: [true, 'Please enter an address']
    },
    state: {
        type: String,
        required: [ true, 'Please enter a state'],
        enum: [
            'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Minor Outlying Islands', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Other'
        ]
    },
    city: {
        type: String,
        required: [true, 'Please enter a city'],
        maxlength: [50, 'City cannot be more than 50 characters']
    },
    zip: {
        type: String,
        required: [true, 'Please enter a zip code'],
        maxlength: [10, 'Zipcode has a max length of 10 characters']
    },
    notes: {
        type: String,
        maxlength: [4000, 'Notes cannot be longer than 4000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    contractNum: {
        type: String,
    },
    contract_type: String,
    contractStartDate: {
        type: Date,
        default: Date.now
    },
    contractEndDate: Date,
    leasedEQ: Boolean,

})

ClientSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g})
    next()
})

module.exports = mongoose.model('Client', ClientSchema)