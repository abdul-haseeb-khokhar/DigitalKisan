const TransportJob = require('../models/TransportJob');

const adminGetAllJobs = async (req, res) => {
    try {
        const {page =1, limit = 10, status} = req.query

        const filter = status ? {status} : {}
        
        const skip = (Number(page) -1) * Number(limit)
        const total = await TransportJob.countDocuments(filter)
        const jobs = await (await TransportJob.find(filter)).toSorted({createdAt : -1}).skip(skip).limit(Number(limit))

        res.status(200).json({
            total, page: Number(page), pages : Math.ceil(total / Number(limit)), jobs
        })
    } catch (error) {
        res.status(500).json({message : 'Server error', error: error.message})
    }
}

module.exports = { adminGetAllJobs }
