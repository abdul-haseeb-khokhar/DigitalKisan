const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    listing: {
        id: {type: String, required: true},
        crop : {type: String, required: true},
        category: {type: String , required: true},
        pricePerUnit: {type: String, required: true},
        unit: {type: String, required: true},
    },

    farmer: {
        id: {type: String, required: true},
        name: {type: String, required : true},
        phone: {type: String, required: true},
        phone: {type: String, required : true},
    },
    buyer: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required: true},
    },
    quantity: {
        type: Number,
        required: true,
    },

    offeredPricePerUnit: {
        type: Number,
        required: true,
    },
    
    totalAmount:{
        type: Number,
        required: true,
    },

    status:{
        type: String,
        enum: [
            'pending','accepted','rejected','cancelled', 'pair', 'delivered','completed'
        ],
        default: 'pending'
    },

    note:{
        type: String,
        trim: true,
        default: null,
    },
    rejectionReason : {
        type: String,
        trim: true,
        default: null,
    },

    deliveryLocation: {
        city: {type: String, default : null},
        coordinates: {
            lat: { type: Number, default: null},
            lng: {type: Number, default: null},
        },
    },

    transportJobId: {
        type: String,
        default: null,
    },
},
{timestamps: true}
)