const app = require('./app')
require('dotenv').config()
const connectDB = require('./config/db')

const dns = require('node:dns').promises;
dns.setServers(["1.1.1.1","1.0.0.1"]);

const PORT = process.env.PORT || 5003
connectDB().then(() =>{
    app.listen(PORT, () =>{
        console.log(`Order service is running at port ${PORT}`)
    })
})