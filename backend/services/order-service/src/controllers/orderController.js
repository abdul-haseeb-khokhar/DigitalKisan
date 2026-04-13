const Order = require('../models/Order')
const axios = require('axios')

const placeOrder = async(req, res) => {
    try  {
        const {listingId, quantity, offeredPricePerUnit, note, deliveryCity, deliveryLat, deliveryLng} =req.body

        if(!listingId || !quantity || !offeredPricePerUnit){
            return res.status(400).json({
                message: 'Please fill all required fields'
            })
        }

        let listing 
        try{
            const response = await axios.get(
                `${process.env.LISTING_SERVICE_URL}/api/listings/${listingId}`
            )

            listing = response.data
        } catch(error) {
            res.status(404).json({
                message: 'Listing not found'
            })
        }
        if(listing.status !== 'active') {
            return res.status(400).json({
                message: 'Listing no longer available'
            })
        }

        if(listing.farmer.id == req.user._id.toString()){
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
                name:listing.farmer.name,
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
            deliveryLocation :{
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
        const order = await Order.findById(req.params.id)

        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        const isInvolved = order.buyer.id === req.user._id.toString() || order.farmer.id === req.user._id.toString()
        if(!isInvolved){
            return res.status(403).json({
                message: 'Not Authorized'
            })
        }

        res.status(200).json(order)
    } catch(error){
        res.status(500).json({
            message:'Server error', error: error.message
        })
    }
} 

const acceptOrder = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)

        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if(order.farmer.id  !== req.user._id to)
    }
}