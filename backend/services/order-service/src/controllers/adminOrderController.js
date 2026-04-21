const Order = require('../models/Order')

const adminGetAllOrders = async(req, res) => {
    try {
        const {page = 1, limit = 20, status} = req.query

        const filter = {}
        if(status) filter.status = status

        const skip = (Number(page) -1) * Number(limit)
        const total = await Order.countDocuments(filter)
        const orders = await Order.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))
        
        res.status(200).json({
            total, page: Number(page), pages: Math.ceil(total/Number(limit)), orders
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const adminGetOrderById = async(req, res) => {
    try {
        const order = await Order.findById(req.params.id) 
        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

module.exports = {
    adminGetAllOrders,
    adminGetOrderById
}