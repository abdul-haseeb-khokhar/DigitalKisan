const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },

    buyer: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required : true},
    },

    farmer: {
        id: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: String, required: true},
    },

    totalAmount: {
        type: Number,
        required: true,
    },

    platformFee: {
        type: Number,
        required: true,
    },

    farmerAmount: {
        type: Number,
        required: true,
    },

    currency: {
        type: String,
        default: 'PKR',
    },

    status: {
        type: String,
        enum: [
            'initiated', 'held', 'released', 'completed', 'disputed', 'refunded', 'failed',
        ],
        default: 'initiated'
    },

    paymentMethod: {
        type: String,
        enum: ['jazzcash', 'easypaisa', 'mock'],
        default: 'mock'
    },

    gatewayTransactionId: {
        type: String,
        default: null,
    },

    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },

    disputeReason: {
        type: String,
        default: null,
    },

    releasedAt: {
        type: Date,
        default: null
    },

    refundedAt: {
        type: Date,
        default: null,
    },
},
    {timestamps : true}
)

module.exports = mongoose.model('Transaction', transactionSchema)