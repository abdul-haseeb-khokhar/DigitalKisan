require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')

const dns = require('node:dns').promises
dns.setServers(["1.1.1.1","1.0.0.1"])

const PORT = process.env.PORT || 5004

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`Payment service is running on port ${PORT}`)
    })
})