const axios = require('axios')

const protect = async(req, res) => {
    let token

    if(
        req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ){
        try{
            token = req.headers.authorization.split(' ')[1]

            const response = await axios.get(
                `${process.env.USER_SERIVCE_URL}/api/auth/get`,
                {headers: {Authorization: `Bearer ${token}`}}
            )

            req.user = response.data
            next()
        } catch(error) {
            return res.status(401).json({
                message: 'Invalid or expired token'
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
                message: `Access denied. Only ${roles.join(', ')} allowed`,
            })
        }

        next()
    }
}

module.exports = {protect, restrictTo}