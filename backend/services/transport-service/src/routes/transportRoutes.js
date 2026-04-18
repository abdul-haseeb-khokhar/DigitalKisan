const express = require('express')
const router = express.Router()
const {
  createJob,
  getAllOpenJobs,
  getMyJobs,
  getJobById,
  cancelJob,
  placeBid,
  getJobBids,
  acceptBid,
  withdrawBid,
  markInTransit,
  markDelivered,
} = require('../controllers/transportController')
const { protect, restrictTo } = require('../middleware/authMiddleware')

router.post('/jobs', protect, restrictTo('farmer', 'buyer'), createJob)
router.get('/jobs', protect, restrictTo('transporter'), getAllOpenJobs)
router.get('/jobs/my', protect, getMyJobs)
router.get('/jobs/:id', protect, getJobById)
router.patch('/jobs/:id/cancel', protect, restrictTo('farmer', 'buyer'), cancelJob)

router.post('/jobs/:id/bids', protect, restrictTo('transporter'), placeBid)
router.get('/jobs/:id/bids', protect, getJobBids)
router.patch('/jobs/:jobId/bids/:bidId/accept', protect, restrictTo('farmer', 'buyer'), acceptBid)
router.patch('/jobs/:jobId/bids/:bidId/withdraw', protect, restrictTo('transporter'), withdrawBid)

router.patch('/jobs/:id/intransit', protect, restrictTo('transporter'), markInTransit)
router.patch('/jobs/:id/delivered', protect, restrictTo('transporter'), markDelivered)

module.exports = router