const axios = require('axios')

const protect = async (req, res, next) => {
    let token

    if(
        req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ){
        try {
            token = req.headers.authorization.split(' ')[1]

            const response = await axios.get(`${process.env.USER_SERVICE_URL}/auth/api/get`,{
                headers: {Authorization: `Bearer ${token}`}
                }
            )

            req.user = response.data
            next()
        } catch (error) {
            return res.status(500).json({
                message: 'Service error', error: error.message
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
                message: `Access denied. Only ${roles.join(', ')} allowed.`
            })
        }
        next()
    }
}