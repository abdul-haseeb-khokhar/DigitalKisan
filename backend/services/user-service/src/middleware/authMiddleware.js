const jwt = require('jsonwebtoken')
const user = require('../models/user')

const protect = async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await user.findById(decoded.id).select('-password')

            if(!req.user){
                return res.status(401).json({
                    message: 'User not found'
                })
            }
            if(req.user.isBanned){
                return res.status(403).json({
                    message: 'Account banned'
                })
            }
            next()
        }catch(err){
            return res.status(401).json({
                message: 'No token provided'
            })
        }
    }
    if(!token){
        return res.status(401).json({
            message: 'No token provided'
        })
    }
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: `Access denied, Only ${roles.join(', ')} allowed.`, 
            })
        }
        next()
    }
}

module.exports = {protect, restrictTo}