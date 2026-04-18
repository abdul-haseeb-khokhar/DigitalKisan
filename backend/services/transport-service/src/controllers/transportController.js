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
    try {
        const { city, page = 1, limit = 10 } = req.query
        const filter = { status: 'open' }
        if (city) filter['pickup.city'] = { $regex: city, $options: 'i' }

        const skip = (Number(page) - 1) * Number(limit)
        const total = await TransportJob.countDocuments(filter)
        const jobs = await TransportJob.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            total, page: Number(page), pages: Math.ceil(total / Number(limit)), jobs,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getMyJobs = async (req, res) => {
    try {
        const { role, _id } = req.user
        const { status, page = 1, limit = 10 } = req.body

        let filter = {}

        if (role === 'farmer') filter['farmer.id'] = _id.toString()
        else if (role === 'buyer') filter['buyer.id'] = _id.toString()
        else if (role === 'transporter') filter['assignedTransporter.id'] = _id.toString()

        if (status) filter.status = status

        const skip = (Number(page) - 1) * Number(limit)
        const total = await TransportJob.countDocuments(filter)
        const jobs = await TransportJob.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            jobs
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getJobById = async (req, res) => {
    try {
        const job = await TransportJob.findById(req.params.id)
        if (!job) {
            return res.status(404).json({
                message: 'Transport job not found'
            })
        }
        res.status(200).json(job)
    }
    catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const cancelJob = async (req, res) => {
    try {
        const job = await TransportJob.findById(req.params.id)
        if (!job) {
            return res.status(404).json({
                message: 'Transport job not found'
            })
        }

        const isInvolved = job.farmer.id === req.user._id.toString() || job.buyer.id === req.user._id.toString()

        if (!isInvolved) {
            return res.status(400).json({
                message: 'Not authorized'
            })
        }

        if (job.status !== 'open') {
            return res.status(400).json({
                message: 'Only open jobs can be cancelled'
            })
        }

        job.status = 'cancelled'
        await job.save()

        await Bid.updateMany({ jobId: job._id.toString(), status: 'pending' }, { status: 'rejected' })

        res.status(200).json({
            message: 'Job cancelled', job
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const placeBid = async (req, res) => {
    try {
        const { price, vehicleType, estimatedHours, note } = req.body
        if (!price || !vehicleType || !estimatedHours) {
            return res.status(400).json({
                message: 'Price, vehicle type and estimated hours are required'
            })
        }
        const job = await TransportJob.findById(req.params.id)
        if (!job) {
            return res.status(404).json({
                message: 'Trnasport job not found'
            })
        }

        if (job.status !== 'open') {
            return res.status(400).json({
                message: 'Job is no longer accepting bids'
            })
        }

        const existingBid = await Bid.findOne({
            jobId: req.params.id,
            'transporter.id': req.user._id.toString(),
            status: 'pending',
        })

        if (existingBid) {
            return res.status(400).json({
                message: 'You already have placed a bid on this job'
            })
        }

        const bid = await Bid.create({
            jobId: req.params.id,
            transporter: {
                id: req.user._id,
                name: req.user.name,
                phone: req.user.phone,
            },
            price,
            vehicleType,
            estimatedHours,
            note: note || null,

        })
        res.status(201).json(bid)
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getJobBids = async (req, res) => {
    try {
        const job = await TransportJob.findById(req.params.id)
        if (!job) {
            return res.status(404).json({
                message: 'Transport hob not found'
            })
        }

        const isInvolved = job.farmer.id === req.user._id.toString() || job.buyer.id === req.user._id.toString()

        if (!isInvolved) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const bids = await Bid.find({ jobId: req.params.id }).sort({ price: 1 })

        res.status(200).json(bids)
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const acceptBid = async (req, res) => {
    try {
        const { jobId, bidId } = req.params
        const job = await TransportJob.findById(jobId)
        if (!job) {
            return res.status(404).json({
                message: 'Transport job not found'
            })
        }

        const isInvolved = job.farmer.id === req.user._id.toString() || job.buyer.id === req.user._id.toString()

        if (!isInvolved) {
            return res.status(403).json({
                message: 'Not authorized'
            })
        }
        if (job.status !== 'open') {
            return res.status(400).json({
                message: 'Job no longer open'
            })
        }

        const bid = await Bid.findById(bidId)
        if (!bid) {
            return res.status(404).json({
                message: 'Bid not found'
            })
        }
        if (bid.status !== 'pending') {
            return res.status(400).json({
                message: 'Bid is no longer available'
            })
        }
        bid.status = 'accepted'
        await bid.save()

        await Bid.updateMany({ jobId, status: 'pending', _id: { $ne: bidId } }, { status: 'rejected' })

        job.status = 'assigned'
        job.assignedBidId = bidId
        job.assignedTransporter = {
            id: bid.transporter.id,
            name: bid.transporter.name,
            phone: bid.transporter.phone,
        }

        await job.save()

        res.status(200).json({
            message: 'Bid accepted. Transporter assigned', job
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const withdrawBid = async (req, res) => {
    try {
        const { jobId, bidId } = req.params

        const bid = await Bid.findById(bidId)
        if (!bid) {
            return res.status(404).json({
                message: 'Bid not found'
            })
        }

        if(bid.transporter.id !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized'
            })
        }

        if (bid.status !== 'pending') {
            return res.status(400).json({
                message: 'Can only withdraw mending bids'
            })
        }

        bid.status = 'withdrawn'
        await bid.save()

        res.status(200).json({
            message: 'Bid withdrawn', bid
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const markInTransit = async (req, res) => {
    try {
        const job = await TransportJob.findById(req.params.id)

        if (!job) {
            return res.status(404).json({
                message: 'Transport job not found'
            })
        }

        if (job.assignedTransporter.id !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the assigned transporter can update this"
            })
        }

        if (job.status !== 'assigned') {
            return res.status(400).json({
                message: 'Job must be assigned before marking in transit'
            })
        }
        job.status = 'in_transit'
        await job.save()

        res.status(200).json({ message: 'Job marked as in transit', job })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const markDelivered = async (req, res) => {
  try {
    const job = await TransportJob.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Transport job not found' })
    }

    if (job.assignedTransporter.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the assigned transporter can update this' })
    }

    if (job.status !== 'in_transit') {
      return res.status(400).json({ message: 'Job must be in transit before marking delivered' })
    }

    job.status = 'delivered'
    job.deliveredAt = new Date()
    await job.save()

    res.status(200).json({ message: 'Job marked as delivered', job })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports= {
    createJob, getAllOpenJobs, getMyJobs, getJobById, cancelJob, placeBid, getJobBids, acceptBid, withdrawBid, markInTransit, markDelivered,
}
