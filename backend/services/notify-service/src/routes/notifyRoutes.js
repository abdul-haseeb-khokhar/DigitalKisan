const express = require('express')
const router = express.Router()
const {
  sendNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcast,
} = require('../controllers/notifyController')
const { protect } = require('../middleware/authMiddleware')

router.post('/send', sendNotification)
router.get('/my', protect, getMyNotifications)
router.patch('/read-all', protect, markAllAsRead)
router.patch('/:id/read', protect, markAsRead)
router.delete('/:id', protect, deleteNotification)
router.post('/broadcast', protect, broadcast)

module.exports = router