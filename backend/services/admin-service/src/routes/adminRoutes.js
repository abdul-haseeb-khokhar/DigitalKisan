const express = require('express')
const router = express.Router()
const {getAllUsers, getUserById, banUser, unbanUser, verifyUser, getAllListings, removeListing, getAllOrders, getOrderById, getAllTransactions, refundPayment, releasePayment, getAllTransportJobs, getDiputedPayments, getAnalytics, sendBroadcast} = require('../controllers/adminController')
const {protectAdmin} = require('../middleware/adminMiddleware')
const { route } = require('./adminAuthRoutes')

router.use(protectAdmin)

router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.patch('/users/:id/ban', banUser)
router.patch('/users/:id/unban', unbanUser)
router.patch('/users/:id/verify', verifyUser)

router.get('/listings', getAllListings)
router.patch('/listings/:id/remove', removeListing)

router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrderById)

router.get('/payments', getAllTransactions)
router.patch('/payments/:id/refund', refundPayment)
router.patch('/payments/:id/release', releasePayment)

router.get('/transport', getAllTransportJobs)

router.get('/disputes', getDisputes)

router.get('/analytics', getAnalytics)

router.post('/broadcast', sendBroadcast)

module.exports = router