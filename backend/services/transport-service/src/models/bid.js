const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
    },
    transporter: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required: true},
    },
    price: {
        type: Number, 
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['motorcycle', 'pickup', 'truck', 'mini_truck', 'tractor'],
        required: true,
    },
    estimatedHours: {
        type: Number, 
        required: true,
    },
    note: {
        type: string,
        default: null,
    },
    status: {
        type: string,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending',
    },
},
    {timestamps: true}
)

module.exports = mongoose.model('Bid', bidSchema)