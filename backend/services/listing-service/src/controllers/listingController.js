const Listing = require('../models/Listing')

const createListing = async(req, res) => {
    try{
        console.log("createListing is called")
        const {crop, category, quantity, pricePerUnit, description, photos, city, lat, lng} = req.body

        if(!crop || !category || !quantity || !pricePerUnit || !city) {
            return res.status(400).json({
                message: 'Please fill all required filds'
            })
        }

        const listing = await Listing.create({
            farmer: {
                id: req.user._id,
                name: req.user.name,
                phone: req.user.phone,
            },
            crop, category, quantity, pricePerUnit, description, photos: photos || [],
            location: {
                city,
                coordinates: {lat: lat || null, lng: lng || null},
            },
        })

        res.status(201).json(listing)
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getAllListings = async (req, res) => {
    try{
        console.log('getAllListings is called')
        const {
            city, category, crop, minPrice, maxPrice, page = 1, limit = 10
        } = req.query

        const filter = { status: 'active' }

        if (city) filter['location.city'] = {$regex : city, $options : 'i'}
        if(category) filter.category = category
        if(crop) filter.crop = {$regex : crop, $options : 'i'}
        if(minPrice || maxPrice){
            filter.pricePerUnit = {}
            if(minPrice) filter.pricePerUnit.$gte =  Number(minPrice)
            if(maxPrice) filter.pricePerUnit.$lte = Number(maxPrice)
        }

        const skip = (Number(page)- 1) * Number(limit)
        const total = await Listing.countDocuments(filter)
        const listings= await Listing.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json(
            {
                total, page: Number(page), 
                pages: Math.ceil(total/Number(limit)),
                listings,
            }
        )
    } catch(err){
        res.status(500).json({
            message: "Server error", error: err.message
        })
    }
}

const getListingById = async (req, res) => {
    try{
        console.log('getListingById is called')
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return res.status(404).json({
                message: 'Listing not found'
            })
        }
        res.status(200).json(listing)
    }catch(err){
        res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}

const getMyListings = async (req, res) => {
    try{
        console.log('getMyListings is called')
        const listings = await Listing.find({
            'farmer.id': req.user._id,
        }).sort({createdAt: -1})

        res.status(200).json(listings)
    } catch(err){
        res.status(500).json({
            message: "Server error", error: err.message
        })
    }
}

const updateListing = async (req, res) => {
    try{
        console.log('updateListing is called ')
        const listing = await Listing.findById(req.params.id)

        if(!listing) {
            return res.status(404).json({
                message:"Listing not found"
            })
        }

        if(listing.farmer.id !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized'
            })
        }

        const fields = [
            'crop', 'category', 'quantity', 'pricePerUnit', 'description', 'photos',
        ]

        fields.forEach((field) => {
            if(req.body[field] !== undefined) listing[field] = req.body[field]
        })

        if(req.body.cit || req.body.lat || req.body.lng){
            listing.location = {
                city: req.body.city || listing.location.city,
                coordinates: {
                    lat: req.body.lat || listing.location.coordinates.lat,
                    lng: req.body.lng || listing.location.coordinates.lng,
                },
            }
        }

        const updated = await listing.save()
        res.status(200).json(updated)
    } catch (error){
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const markAsSold = async (req, res) => {
    try{
        console.log("markAsSold is called")
        const listing = await Listing.findById(req.params.id)

        if(!listing) {
            return res.status(404).json({
                message: 'Listing not found'
            })
        }

        if(listing.farmer.id !== req.user._id.toString()){
            return res.status(403).json({
                message: 'Not authorized'
            })
        }
        listing.status = 'sold'
        await listing.save()
        res.status(200).json({
            message: 'Listing marked as sold'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Server Error', error: err.message
        })
    }
}

const deleteListing = async(req, res) => {
    try{
        console.log("deleteListing is called")
        const listing = await Listing.findById(req.params.id)

        if(!listing) {
            res.status(404).json({
                message: "Listing not found"
            })
        }

        if(listing.farmer.id !== req.user._id.toString()){
            res.status(403).json({
                message: 'Not authorized'
            })
        }

        listing.status = 'removed'
    } catch(error){
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

module.exports = {
    createListing, getAllListings, getListingById, getMyListings, updateListing, markAsSold, deleteListing,
}