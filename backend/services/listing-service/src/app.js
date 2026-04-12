const express = require('express')
const cors = require('cors')
const listingRoutes = require('./routes/listingRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/listings', listingRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'listing-service', status:'running'
    })
})

app.use((req, res) => {
    res.status(404).json({
        message:'Route not found'
    })
})

module.exports = app