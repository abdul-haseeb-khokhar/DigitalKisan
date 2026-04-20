const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {updateProfile, getUserById, updateFcmToken, getAllUsers, banUser, unbanUser, verifyUser} = require('../controllers/profileController')

router.get('/all', getAllUsers)
router.put('/update', protect, updateProfile)
router.put('/fcm-token', protect, updateFcmToken)
router.patch('/:id/ban', banUser)
router.patch('/:id/unban', unbanUser)
router.patch('/:id/verify', verifyUser)
router.get('/:id', getUserById)

module.exports = router