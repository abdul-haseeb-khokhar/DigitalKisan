const express = require('express')
const router = express.Router()

const { adminGetAllJobs } = require('../controllers/adminTransportController')

router.get('/all', adminGetAllJobs)

module.exports = router