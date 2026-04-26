const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({}, {strict: false})

module.exports = mongoose.model('Transaction', transactionSchema)