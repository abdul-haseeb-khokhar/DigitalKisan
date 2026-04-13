const axios = require('axios')
const { response } = require('../app')

const protect = async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try{
            token = req.headers.authorization.split(' ')[1]

            const reponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/auth/getMe`,{
                headers: {Authorization : `Bearer ${token}`},
            })

            req.user = response.data

            next()
        } catch (error){
            return res.status(401).json({
                message: 'Invalid or expired token'
            })
        }
    }
}

const restrictTo = (...roles) => {
    return(req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:`Access denied. Only ${roles.join(', ')} allowed.`
            })
        }
        next()
    }
}

module.exports = {protect, restrictTo}