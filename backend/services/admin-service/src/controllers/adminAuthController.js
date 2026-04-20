const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')

const generateToken= (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

const login = async(req, res) => {
    try{
        const {email, password} = req.body

        if(!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }

        const admin = await Admin.findOne({ email })
        if(!admin){
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }
        const isMatch = await admin.matchPassword(password)
        if(!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        res.status(200).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            isSuperAdmin: admin.isSuperAdmin,
            toke: generateToken(admin._id),
        })
    } catch( error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getMe = async (req, res) => {
    res.status(200).json(req.admin)
}

module.exports = {login, getMe}