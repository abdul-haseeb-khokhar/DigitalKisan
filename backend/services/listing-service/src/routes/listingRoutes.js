const express = require('express')
const router = express.Router()

const {
    createListing, getAllListings, getListingById, getMyListings, updateListing, markAsSold, deleteListing,
} = require('../controllers/listingController')

const {protect, restrictTo} = require('../middleware/authMiddleware')

router.get('/', getAllListings)
router.get('/my',protect, getMyListings)
router.get('/:id', getListingById)
router.post('/', protect,restrictTo('farmer'), createListing)
router.put('/:id', protect, restrictTo('farmer'), updateListing)
router.patch('/:id/sold', protect, restrictTo('farmer'), markAsSold)
router.delete('/:id', protect, restrictTo('farmer'), deleteListing)

module.exports = router
