const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {updateProfile, getUserById, updateFcmToken} = require('../controllers/profileController')


router.put('/update', protect, updateProfile)
router.get('/:id', getUserById)
router.put('/fcm-token', protect, updateFcmToken)

module.exports = router