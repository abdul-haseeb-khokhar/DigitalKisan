const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            id: { type: String, required: true },
            role: { type: String, required: true },
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                'new_listing',
                'order_placed',
                'order_accepted',
                'order_rejected',
                'order_cancelled',
                'payment_confirmed',
                'transport_job_created',
                'bid_placed',
                'bid_accepted',
                'in_transit',
                'delivered',
                'dispute_raised',
                'broadcast',
            ],
            required: true,
        },
        channels: {
            push: {type: Boolean, default: false},
            sms: {type: Boolean, default: false},
            inApp: {type: Boolean, default: true}
        },
        isRead: {
            type: Boolean, default: false,
        },
        refId: {
            type: String,
            default: null,
        },
        refModel: {
            type: String, 
            enum: ['order', 'listing', 'transport', 'payment', null],
            default: null,
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('Notification', notificationSchema)