const express = require('express')
const router = express.Router()
const{initiatePayment, paymentCallback, confirmDelivery, raiseDispute, getTransactionById, getTransactionByOrderId} = require('../controllers/paymentController')
const { protect , restrictTo} = require('../middleware/authMiddleware')


router.post('/initiate', protect , restrictTo('buyer'), initiatePayment)
router.post('/callback', paymentCallback)
router.post('/:id/confirm', protect, restrictTo('buyer'), confirmDelivery)
router.post('/:id/dispute', protect, restrictTo('buyer'), raiseDispute)
router.get('/order/:orderId', protect, getTransactionByOrderId)
router.get('/:id', protect, getTransactionById)


module.exports = router