const express = require('express')
const cors = require('cors')

const paymentRoutes = require('./routes/paymentRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/payments', paymentRoutes)

app.get('/health', (req, res)=> {
    return res.status(200).json({
        service: 'payment-service', status: 'running'
    })
})

app.use((req, res) => {
    return res.status(404).json({
        message: 'Route not found'
    })
})

module.exports = app