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