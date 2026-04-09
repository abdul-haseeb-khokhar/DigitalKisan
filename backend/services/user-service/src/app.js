const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/profile',profileRoutes)
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'user-service', status: 'running'
    })
})

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
})

module.exports = app