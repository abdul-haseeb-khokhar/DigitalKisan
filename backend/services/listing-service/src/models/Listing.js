const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    farmer: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required: true},
    },
    crop:{
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['mainCrops','pulses','vegetables','fruits','fodderCrops','other' ],
    },
    quantity:{
        value: {type: Number, required: true},
        unit: {
            type: String, 
            enum:['kg', 'ton', 'dozen'],
            required: true,
        },
    },

    pricePerUnit:{
        type: Number,
        require: true
    },
    description:{
        type: String,
        trim: true,
        default: null,
    },
    photos: {
        type: [String],
        default:[]
    },
    location: {
        city: {type:String, required: true},
        coordinates: {
            lat:{type: Number, default: null},
            lng:{type: Number, default: null},
        },
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'removed'],
        default:'active',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
},
{timestamps: true}
)

module.exports = mongoose.model('Listing', listingSchema)