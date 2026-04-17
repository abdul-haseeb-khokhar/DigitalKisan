const TransportJob = require('../models/TransportJob')
const Bid = require('../models/Bid')
const axios = require('axios')

const createJob = async (req, res) => {
    try {
        const { orderId, pickupCity, pickupAddress, pickupLat, pickupLng, dropoffCity, dropoffAddress, dropoffLat, dropoffLng, weightEstimate, note, } = req.body

        if (!orderId || !pickupCity || !dropoffCity) {
            return res.status(400).json({
                message: 'OrderId, pickupCity, dropOffCity are required'
            })
        }

        const existingJob = await TransportJob.findOne({ orderId })
        if (existingJob) {
            return res.status(400).json({
                message: 'Transport job already exist for this order'
            })
        }

        let order
        try {
            const response = await axios.get(
                `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}`,
                { headers: { Authorization: req.headers.authorization } }
            )

            order - response.data
        } catch (error) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        const isInvolved = order.buyer.id === req.user._id.toString() || order.farmer.id === req.user._id.toString()

        if (!isInvolved) {
            return res.status(403).json({
                message: 'Not authorized to create job for this job'
            })
        }

        if (order.status !== 'paid') {
            return res.status(400).json({
                message: 'Order must be paid before creating job'
            })
        }

        const job = await TransportJob.create({
            orderId,
            createdBy: {
                id: req.user._id, name: req.user.name, phone: req.user.phone, role: req.user.role,
            },
            farmer: {
                id: order.farmer.id,
                name: order.farmer.name,
                phone: order.farmer.phone,
            },
            buyer: {
                id: order.buyer.id,
                name: order.buyer.name,
                phone: order.buyer.phone,
            },
            cargo: {
                crop: order.listing.crop,
                quantity: order.quantity,
                unit: order.listing.unit,
                weightEstimate: weightEstimate || null,
            },
            pickup: {
                city: pickupCity,
                address: pickupAddress || null,
                coordinates: {
                    lat: pickupLat || null,
                    lng: pickupLng || null,
                },
            },
            dropoff: {
                city: dropoffCity,
                address: dropoffAddress || null,
                coordinates: {
                    lat: dropoffLat || null,
                    lng: dropoffLng || null,
                },
            },
            note: note || null,
        })

        res.status(201).json(job)
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const getAllOpenJobs = async (req, res) => {
    try{
        const{ city, page = 1, limit = 10} =req.query
        const filter = {status: 'open'}
        if(city) filter['pickup.city'] = {$regex : city, $options: 'i'}

        const skip = (Number(page)-1) * Number(limit)
        const total = await TransportJob.countDocuments(filter)
        const jobs = await TransportJob.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            total, page: Number(page), pages: Math.ceil(total/Number(limit)),jobs,
        })
    } catch(error){
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getMyJobs = async(req, res) => {
    try{
        const {role, _id} = req.user
        const {status, page = 1, limit = 10} = req.body

        let filter = {}

        if( role === 'farmer') filter['farmer.id'] = _id.toString()
        else if(role === 'buyer') filter['buyer.id'] = _id.toString()
        else if( role === 'transporter') filter['assignedTransporter.id'] = _id.toString()

        if(status) filter.status = status

        const skip = (Number(page)-1) * Number(limit)
        const total = await TransportJob.countDocuments(filter)
        const jobs = await TransportJob.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))
        
        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total/Number(limit)),
            jobs
        })
    } catch(error){
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}