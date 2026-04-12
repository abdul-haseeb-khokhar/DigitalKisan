const app = require('./app')
const connectDB = require('./config/db')

require('dotenv').config()

const PORT = process.env.PORT || 5002

connectDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`Listening service running on port ${PORT}`)
    })
})