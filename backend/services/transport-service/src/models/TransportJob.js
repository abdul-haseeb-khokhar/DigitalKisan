const mongoose = require('mongoose')

const transportJobSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },

    createdBy: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required: true},
        role: {type: String, required: true},
    },
    farmer: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone:{type: String, required: true},
    },
    buyer: {
        id:{type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required: true},
    },
    cargo:{
        crop: {type:String, required: true},
        quantity: {type: Number, required: true},
        unit: {type: String, required: true},
        weightEstimate: {type: Number, default: null},
    },
    pickup : {
        city: {type: String, required: true},
        adress: {type: String, default: null},
        coordinates: {
            lat: {type: Number, default: null},
            lng: {type: String, default: null},
        },
    },
    dropoff:{
        city:{type: String, required: true},
        adress: {type: String, default: null},
        coordinates: {
            lat: {type: String, default: null},
            lng: {type: String, default: null},
        },
    },
    assignedBidId: {
        type: String,
        default: null,
    },
    assignedTransporter: {
        id: {type: String, default: null},
        name: {type: String, default: null},
        phone: {type: String, default: null},
    },

    status: {
        type: String, 
        enum: ['open', 'assigned', 'in_transit', 'delivered', 'completed', 'cancelled'],
        default: 'open'
    },
    note: {
        type: String, 
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null,
    },

    completedAt: {
        type: Date,
        default: null,
    },
},
{timestamps : true}
)

module.exports = mongoose.model('TransportJob', transportJobSchema)