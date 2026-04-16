const Order = require('../models/Order')
const axios = require('axios')

const placeOrder = async (req, res) => {
    try {
        console.log(
            "placeOrder function is called"
        )
        const { listingId, quantity, offeredPricePerUnit, note, deliveryCity, deliveryLat, deliveryLng } = req.body

        if (!listingId || !quantity || !offeredPricePerUnit) {
            return res.status(400).json({
                message: 'Please fill all required fields'
            })
        }

        let listing
        try {
            const response = await axios.get(
                `${process.env.LISTING_SERVICE_URL}/api/listings/${listingId}`
            )

            listing = response.data
        } catch (error) {
            res.status(404).json({
                message: 'Listing not found'
            })
        }
        if (listing.status !== 'active') {
            return res.status(400).json({
                message: 'Listing no longer available'
            })
        }

        if (listing.farmer.id == req.user._id.toString()) {
            return res.status(400).json({
                message: 'You cannot order your own listing'
            })
        }

        const totalAmount = quantity * offeredPricePerUnit

        const order = await Order.create({
            listing: {
                id: listing._id,
                crop: listing.crop,
                category: listing.category,
                pricePerUnit: listing.pricePerUnit,
                unit: listing.quantity.unit
            },
            farmer: {
                id: listing.farmer.id,
                name: listing.farmer.name,
                phone: listing.farmer.phone,
            },
            buyer: {
                id: req.user._id,
                name: req.user.name,
                phone: req.user.phone,
            },

            quantity,
            offeredPricePerUnit,
            totalAmount,
            note: note || null,
            deliveryLocation: {
                city: deliveryCity || null,
                coordinates: {
                    lat: deliveryLat || null,
                    lng: deliveryLng || null
                },
            }
        })
        res.status(201).json(order)
    } catch (err) {
        res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        console.log("getOrderById func is called")
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        const isInvolved = order.buyer.id === req.user._id.toString() || order.farmer.id === req.user._id.toString()
        if (!isInvolved) {
            return res.status(403).json({
                message: 'Not Authorized'
            })
        }

        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const acceptOrder = async (req, res) => {
    try {
        console.log("acceptOrder function is called")
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if (order.farmer.id !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Only farmer can accept this order'
            })
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                message: `Order is already ${order.status}`
            })
        }

        order.status = 'accepted'
        await order.save()

        res.status(200).json({
            message: 'Order accepted', order
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getMyOrders = async (req, res) => {
    try {
        console.log('getMyOrders func is called')
        const { role } = req.user
        const { status, page = 1, limit = 1 } = req.query

        let filter = {}

        if (role === 'buyer') {
            filter['buyer.id'] = req.user._id.toString()
        } else if (role === 'farmer') {
            filter['farmer.id'] = req.user._id.toString()
        } else {
            return res.status(403).json({
                message: 'Access denied'
            })
        }

        if (status) filter.status = status

        const skip = (Number(page) - 1) * Number(limit)
        const total = await Order.countDocuments(filter)
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}

const rejectOrder = async (req, res) => {
    try {
        console.log("rejectOrder func is called")
        const { rejectionReason } = req.body
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if (order.farmer.id !== req.user._id.toString()) {
            return res.status(403).json({
                Message: 'Only farmer can reject this order'
            })
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                message: `Order is already ${order.status}`
            })
        }

        order.status = 'rejected'
        order.rejectionReason = rejectionReason || null
        await order.save()

        res.status(200).json({
            message: 'Order rejected', order
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        console.log("cancelOrder function is called")
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if (order.buyer.id !== req.user._id.toString()){
            return res.status(403).status({
                message: 'Only buyer can cancel this order'
            })
        }

        if (order.status !== 'pending'){
            return res.status(400).status({
                message: 'Only pending orders can be cancelled'
            })
        }

        order.status = 'cancelled'
        await order.save()

        res.status(200).json({
            message: 'Order cancelled', order
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)

        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        const validTransitions = {
            accepted: ['paid'],
            paid: ['delivered', 'completed'],
            delivered: ['completed']
        }

        const allowedNext= validTransitions[order.status] || []
        const newStatus = req.path.includes('paid') ? 'paid' : 'completed'

        if(!allowedNext.includes(newStatus)){
            return res.status(400).json({
                message: `Cannot transition from ${order.status} to ${newStatus}`
            })
        }

        order.status = newStatus
        await order.save()
        res.status(200).json({
            message: `Order marked as ${newStatus}`, order
        })
    } catch(error){
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }

}


module.exports = { placeOrder, getMyOrders, getOrderById, acceptOrder, rejectOrder, cancelOrder, updateOrderStatus}