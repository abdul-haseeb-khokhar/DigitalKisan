const express = require('express')
const router = express.Router()
const {login, getMe} = require('../controllers/adminAuthController')
const {protectAdmin} = require('../middleware/adminMiddleware')


router.post('/login', login)
router.get('/me', protectAdmin, getMe)

module.exports = router