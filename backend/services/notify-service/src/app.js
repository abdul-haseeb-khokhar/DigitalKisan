const express = require('express')
const cors = require('cors')
const notifyRoutes = require('./routes/notifyRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/notify', notifyRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ service: 'notify-service', status: 'running' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

module.exports = app