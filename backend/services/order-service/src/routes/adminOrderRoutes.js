const express = require('express')
const router = express.Router()

const {adminGetAllOrders, adminGetOrderById} = require('../controllers/adminOrderController')

router.get('/', adminGetAllOrders)
router.get('/:id', adminGetOrderById)

module.exports = router