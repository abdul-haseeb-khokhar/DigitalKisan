const Transaction = require(
    '../models/Transaction'
)

const adminGetAllTransactions = async (req, res) => {
    try {
        const {page = 1, limit = 10, status} = req.query

        const filter = {}
        if( status ){
            filter.status = status
        }

        const skip = (Number(page) -1) * Number(limit)
        const total = await Transaction.countDocuments(filter)
        const transactions = await Transaction.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))
        
        res.status(200).json({
            total,  page : Number(page), pages : Math.ceil(total/Number(limit)), transactions
        })


    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const adminRefundPayment = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
        if(!transaction){
            return res.status(404).json({
                message: 'Transaction not found'
            })

            if(transaction.status !== 'disputed'){
                return res.status(400).json({
                    message: 'Only disputed transactions can be refunded'
                })
            }

            transaction.status = 'refunded'
            transaction.refundedAt = new Date()
            await transaction.save()

            res.status(200).json({
                message: 'Transaction refunded to buyer by admin', transaction
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const adminReleasePayment = async (req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id)
        if(!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        if(transaction.status !== 'disputed'){
            return res.status(400).json({
                message: 'Only disputed transactions can be released'
            })
        }

        transaction.status = 'released'
        transaction.releasedAt = new Date()
        await transaction.save()
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

module.exports = {
    adminGetAllTransactions,
    adminRefundPayment,
    adminReleasePayment
}