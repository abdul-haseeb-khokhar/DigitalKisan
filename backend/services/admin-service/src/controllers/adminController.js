const axios = require('axios')

const getAuthHeader = (req) => ({
    headers: {Authorization: req.headers.authorization},
})

// USERS 

const getAllUsers = async (req, res) => {
    try {
        const {role, page = 1, limit = 20} = req.query
        const query = new URLSearchParams({page, limit})

        if(role) query.append('role', role)

        const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/profile/all?${query}`,
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch (error){
        res.status(500).json({
            message: 'Failed to fetch users', error : error.message
        })
    }
}

const getUserById = async (req, res) => {
    try{
        const response = await axios.get(
            `${process.env.USER_SERVICE_URL}/api/profile/${req.params.id}`,
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({
            message : 'User not found'
        })
    }
}

const banUser = async (req, res) => {
    try{
        const response = await axios.patch(
            `${process.env.USER_SERVICE_URL}/api/profile/${req.params.id}/ban`,{},
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch (error){
        res.status(500).json({
            message: 'Failed to ban', error : error.message
        })
    }
}

const unbanUser = async (req, res) => {
    try{
        const response = await axios.patch(`${process.env.USER_SERVICE_URL}/api/profile/${req.params.id}/unban`,{},
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to unban user', error: error.message
        })
    }
}

const verifyUser = async(req, res) => {
    try {
        const response = await axios.patch(`${process.env.USER_SERVICE_URL}/api/profile/${req.params.id}/verify`,{},
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to verify user', error : error.message
        })
    }
}

// LISTINGS

const getAllListings = async (req, res) => {
    try {
        const {page = 1, limit = 20, status} = req.query
        const query = new URLSearchParams({ page, limit})
        if(status) query.append('status', status)

        const response = await axios.get(`${process.env.LISTING_SERVICE_URL}/api/listings/admin/all?${query}`,
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    }catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch listings', error: error.message
        })
    }
}

const removeListing = async(req, res) => {
    try {
        const response = await axios.patch(`${process.env.LISTING_SERVICE_URL}/api/listings/admin/${req.params.id}/remove`,{},
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch (error){
        return res.status(500).json({
            message: 'Failed to remove listing', error: error.message
        })
    }
}

// ORDERS

const getAllOrders = async(req, res) => {
    try {
        const {page = 1, limit = 1, status} = req.query
        const query = new URLSearchParams({page, limit})
        if(status) query.append('status', status)

        const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/orders/admin/all?${query}`,
            getAuthHeader(req)
        )

        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to fetch orders', error: error.message
        })
    }
}

const getOrderById = async(req, res) => {
    try{
        const response = await axios.get( 
            `${process.env.LISTING_SERVICE_URL}/api/orders/admin/${req.params.id}`,
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch (error) {
        res.status(404).json({
            message: 'Order not found'
        })
    }
}

// PAYMENTS 
const getAllTransactions = async (req, res) => {
    try{
        const {page = 1, limit = 20, status} =req.query
        const query = new URLSearchParams({page, limit})
        if (status) query.append('status', status)

        const response = await axios.get(`${process.env.PAYMENT_SERVICE_URL}/api/admin/paymnets/all?${query}`,
            getAuthHeader(req)
        )

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch transactions', error: error.message
        })
    }
}

const refundPayment = async (req, res) => {
    try {
        const response = await axios.patch(`${process.env.PAYMENT_SERVICE_URL}/api/admin/payments/${req.params.id}/refund`,{},
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to refund payment', error: error.message
        })
    }
}

const releasePayment = async (req, res) => {
    try {
        const response = await axios.patch(`${process.env.PAYMENT_SERVICE_URL}/api/admin/payments/${req.params.id}/release`,{},
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to release payment', error: error.message
        })
    }
}

const getDiputedPayments = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.PAYMENT_SERVICE_URL}/api/admin/payments/all?status=disputed`,
            getAuthHeader(req)
        )
        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to fetch disputes', error: error.message
        })
    }
}

// TRANSPORT

const getAllTransportJobs = async (req, res) => {
    try {
        const {page = 1, limit = 20, status} = req.query
        const query = new URLSearchParams({page, limit})
        if(status) query.append('status', status)

        const response = await axios.get(`${process.env.TRANSPORT_SERVICE_URL}/api/admin/transport/all?${query}`,
            getAuthHeader(req)
        )

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch transport jobs', error: error.message
        })
    }
}

// ANALYTICS

const getAnalytics = async (req, res) => {
    try {
        const [usersRes, listingsRes, ordersRes, paymentsRes] = await Promise.all([
            axios.get(`${process.env.USER_SERVICE_URL}/api/profile/all?limit=1`, getAuthHeader(req)),
            axios.get(`${process.env.LISTING_SERVICE_URL}/api/admin/listings/all?limit=1`, getAuthHeader(req)),
            axios.get(`${process.env.ORDER_SERVICE_URL}/api/admin/orders/all?limit=1`, getAuthHeader(req)),
            axios.get(`${process.env.PAYMENT_SERVICE_URL}/api/admin/payments/all?limit=1`, getAuthHeader(req))
        ])

        res.status(200).json({
            totalUsers: usersRes.data.total || 0,
            totalListings: listingsRes.data.total || 0,
            totalOrders: ordersRes.data.total || 0, 
            totalTransactions: paymentsRes.data.total || 0
        })

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch analytics', error: error.message
        })
    }
}

// BROADCAST

const sendBroadcast = async (req, res) => {
    try{
        const {title, message, targetRole} = req.body
        if(!title || !message) {
            return res.status(400).json({
                message: 'Title and message are required'
            })
        }

        const response = await axios.post(`${process.env.NOTIFY_SERVICE_URL}/api/notify/broadcast`, {title, message, targetRole},
            getAuthHeader(req)
        )

        res.status(200).json(response.data)
    } catch(error) {
        res.status(500).json({
            message: 'Failed to send broadcast', error: error.message
        })
    }
}

module.exports = {getAllUsers, getUserById, banUser, unbanUser, verifyUser, getAllListings, removeListing, getAllOrders, getOrderById, getAllTransactions, refundPayment, releasePayment, getDiputedPayments, getAllTransportJobs, getAnalytics, sendBroadcast}