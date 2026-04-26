const express = require('express')
const cors = require('cors')
const adminAuthRoutes = require('./routes/adminAuthRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin', adminRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'admin-service', status: 'running'
    })
})

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
})

module.exports = app