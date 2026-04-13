const express = require('express')
const router = express.Router()

const {placeOrder, getMyOrders, getOrderById, acceptOrder, rejectOrder, cancelOrder} = require('../controllers/orderController')
const { protect, restrictTo } = require('../middleware/authMiddleware')


router.post('/', protect, restrictTo('buyer'),placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.patch('/:id/accept',protect, restrictTo('farmer'), acceptOrder)
router.patch('/:id/reject',protect, restrictTo('farmer'), rejectOrder)
router.patch('/:id/cancel', protect, restrictTo('buyer'), cancelOrder)

module.exports = router