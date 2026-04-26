const express = require('express')
const cors = require('cors')
const transportRoutes = require('./routes/transportRoutes')
const adminTransportRoutes = require('./routes/adminTransportRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/transport', transportRoutes)
app.use('/api/admin/transport', adminTransportRoutes)
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'transport-service', status: 'running' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

module.exports = app