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

            res.status(201).json({
                message: 'Payment initiated',
                transaction,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}
