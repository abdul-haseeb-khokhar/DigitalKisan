const Transaction = require('../models/Transaction')
const axios = require('axios')

const initiatePayment = async(req, res) => {
    try{
        const {orderId, paymentMethod = 'mock'} = req.body

        if(!orderId) {
            return res.status(400).json({
                message: 'Order ID required'
            })
        }

        let order
        try{
            const response = await axios.get(
                `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}`, {
                    headers: {Authorization: req.headers.authorization}
                }
            )

            order = response.data
        } catch (err) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if( order.buyer.id !== req.user._id.toString()){
            return res.status(403).json({
                message: 'Only Buyer can initiate payment'
            })
        }

        if(order.status !== 'accepted'){
            return res.status(400).json({
                message: 'Ordrer must be accepted before payment'
            })
        }

        const existingTransaction = await Transaction.findOne({orderId})

        if(existingTransaction){
            return res.status(400).json({
                message: 'Payment already initiated for this order'
            })
        }

        const platformFeePercent = Number(process.env.PLATFORM_FEE_PERCENT)/100
        const platformFee = parseFloat(order.totalAmount * platformFeePercent).toFixed(2)
        const farmerAmount = parseFloat(order.totalAmount - platformFee).toFixed(2)

        const transaction = await Transaction.create({
            orderId,
            buyer: {
                id: order.buyer.id,
                name: order.buyer.name,
                phone: order.buyer.phone,
            },
            farmer: {
                id: order.farmer.id,
                name: order.farmer.name,
                phone: order.farmer.phone,
            },

            totalAmount: order.totalAmount,
            platformFee,
            farmerAmount,
            paymentMethod,
            status: 'initiated',
        })

        if(paymentMethod === 'mock') {
            transaction.status = 'held'
            transaction.gatewayTransactionID =`MOCK-${Date.now()}`
            transaction.gatewayResponse = {mock: true, message: 'Mock payment successfull'}
            await transaction.save()

            await axios.patch(`${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}/paid`,{},{
                headers: {Authorization: req.headers.authorization}
            })

            return res.status(200).json({
                message: 'Mock payment successful. Funds held in escrow',
                transaction,
            })

        }

        res.status(201).json({
            message: 'Payment initiated',
            transaction,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const paymentCallback = async (req, res) => {
    try {
        const {orderId, gatewayTransactionId, status, gatewayResponse} = req.body

        const transaction = await Transaction.findOne({ orderId })
        if(!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        if( status === 'success') {
            transaction.status = 'held'
            transaction.gatewayTransactionId =  gatewayTransactionId
            transaction.gatewayResponse = gatewayResponse || null

            await transaction.save()

            await axios.patch( `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}/paid`,{},
                {headers: {Authorization : `Bearer internal`}}
            )

            return res.status(200).json({
                message: 'Payment Confirmed. Funds held in escrow'
            })
        }

        transaction.status = 'failed'
        transaction.gatewayResponse = gatewayResponse || null
        await transaction.save()

        res.status(200).json({
            message: 'Payment Failed'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const confirmDelivery = async (req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id)

        if(!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        if(transaction.buyer.id !== req.user._id.toString()){
            return res.status(403).json({
                message: 'Only the buyer can confirm deleivery'
            })
        }

        if(transaction.status !== 'held'){
            return res.status(400).json({
                message: 'Funds are not in escrow'
            })
        }

        transaction.status = 'released'
        transaction.releasedAt = new Date()
        await transaction.save()

        await axios.patch(
            `${process.env.ORDER_SERVICE_URL}/api/orders/completed`,{},{
                headers: {Authorization: req.headers.authorization}
            }
        )

        res.status(200).json({
            message: 'Delivery confirmed. Funds released to farmer.',
            farmerAmount: transaction.farmerAmount,
            platformFee: transaction.platformFee,
            transaction,
        })
    } catch (error){
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const raiseDispute = async (req, res) => {
    try {
        const {disputeReason} = req.body
        const transaction = await Transaction.findById(req.params.id)

        if(!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        if(transaction.buyer.id !== req.user._id.toString()){
            return res.status(403).json({
                message: 'Only the buyer can raise a dispute'
            })
        }

        if(transaction.status !== 'held'){
            return res.status(400).json({
                message: 'Can only dispute held transactions'
            })
        }

        if(!disputeReason){
            return res.status(400).json({
                message: 'Please provide a dispute reason'
            })
        }

        transaction.status = 'disputed'
        transaction.disputeReason = disputeReason
        await transaction.save()

        res.status(200).json({
            message: 'Dispute raised. Admin will review shortly',
            transaction,
        })
    }   catch (error) {
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getTransactionById = async (req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id)

        if(!transaction){
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        const isInvolved = transaction.buyer.id === req.user._id.toString() || transaction.farmer.id === req.user._id.toString()

        if(!isInvolved){
            return res.status(403).json({
                message: 'Not authorized'
            })
        }

        res.status(200).json(transaction)
    } catch (error) {
        return res.status(500).json({
            message: 'Server error', error : error.message
        })
    }
}

const getTransactionByOrderId = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            orderId: req.params.orderId,
        })

        if(!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        const isInvolved = transaction.buyer.id === req.user._id.toString() || transaction.farmer.id === req.user._id.toString()

        if(!isInvolved){
            return res.status(403).json({
                message: 'Not authorized'
            })
        }

        res.status(200).json(transaction)
    } catch (error) {
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

module.exports = {
    initiatePayment, paymentCallback, confirmDelivery, raiseDispute, getTransactionById, getTransactionByOrderId
}