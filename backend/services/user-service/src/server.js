const app = require('./app')
const connectDB = require('./config/db')
require('dotenv').config()

const PORT=process.env.PORT || 5001

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`User service is runnig on port ${PORT}`)
    })
})