const app = require('./app')
const connectDB = require('./config/db')
require('dotenv').config()

const dns = require('node:dns').promises
dns.setServers(['1.1.1.1','1.0.0.1'])
const PORT = process.env.PORT || 5005

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Transport service running on port ${PORT}`)
  })
})