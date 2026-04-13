const express = require('express')
const cors = require('cors')

const orderRoutes = require('./routes/orderRoutes')

const app = express()
app.use(cors())

app.use(express.json())

app.use('/api/orders', orderRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'order-service', status: 'runnig'
    })
})

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
})

module.exports = app