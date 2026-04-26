const app = require('./app')
const connectDB = require('./config/db')

const seedAdmin = require('./config/seed')
require('dotenv').config()

const dns = require('node:dns').promises
dns.setServers(['1.1.1.1','1.0.0.1'])


const PORT = process.env.PORT || 5007
connectDB().then(async () => {
    await seedAdmin()
    app.listen(PORT, ()=>{
        console.log(`Admin service is running on port ${PORT}`)
    })
})