const express = require('express')
const router = express.Router()

const {adminGetAllListings, adminRemoveListing} = require('../controllers/adminListingController')

router.get('/all', adminGetAllListings)
router.patch('/:id/remove', adminRemoveListing)

module.exports = router