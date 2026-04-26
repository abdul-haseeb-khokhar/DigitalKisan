const express = require('express')
const router = express.Router()

const {adminGetAllTransactions, adminRefundPayment, adminReleasePayment} = require('../controllers/adminPaymentController')

router.get('/all', adminGetAllTransactions)
router.patch('/:id/refund', adminRefundPayment)
router.patch('/:id/release', adminReleasePayment)

module.exports = router