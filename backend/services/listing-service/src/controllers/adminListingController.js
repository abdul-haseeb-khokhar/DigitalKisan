const Listing = require('../models/Listing')

const adminGetAllListings = async(req, res) => {
    try{
        const {page = 1, limit = 20, status} = req.query
        const filter = {}
        if(status) filter.status = status

        const skip = (Number(page)-1) *Number(limit)
        const total = await Listing.countDocuments(filter)
        const listings = await Listing.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))
            
        res.status(200).json({
            total, page: Number(page), pages: Math.ceil(total/Number(limit)), listings
        })
    } catch(error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const adminRemoveListing = async (req, res) => {
    try{
        const listing = await Listing.findById(req.params.id)
        if(!listing) {
            return res.status(404).json(
                {
                    message: 'Listing not found'
                }
            )
        }

        listing.status = 'removed'
        await listing.save()

        res.status(200).json({
            message: 'Listing removed by admin'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

module.exports = { adminGetAllListings, adminRemoveListing }