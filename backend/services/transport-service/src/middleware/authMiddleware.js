const axios = require('axios')

const protect = async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try{
            token = req.headers.authorization.split(' ')[1]

            const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/auth/get`,
                {headers: {Authorization: `Bearer ${token}`}}
            )

            req.user = response.data
            next
        }
        catch(error){
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