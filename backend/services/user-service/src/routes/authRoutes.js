const express = require('express')
const router = express.Router()
const {register, login, getMe} = require('../controllers/authController')
const {protect} = require('../middleware/authMiddleware')

router.post('/register', register, () => {
    console.log('Register Route called')
})
router.post('/login', login)

router.get('/get', protect, getMe)

module.exports = router