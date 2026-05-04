const user = require('../models/user')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const register = async (req, res) => {
    try {
        console.log("Register function called!")
        const { name, phone, email, password, role } = req.body

        if (!name || !phone || !password || !role) {
            return res.status(400).json({
                message: "Please Fill all required fields"
            })
        }

        const validRoles = ['farmer', 'buyer', 'transporter']
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: 'Invalid role'
            })
        }

        const phoneExists = await user.findOne({ phone })
        if (phoneExists) {
            return res.status(400).json({
                message: 'Phone number already registered'
            })
        }

        if (email) {
            const emailExists = await user.findOne({ email })
            if (emailExists) {
                return res.status(400).json({
                    message: 'Email already registered'
                })
            }
        }

        const newUser = await user.create({
            name, phone, email, password, role
        })

        const token = generateToken(newUser._id)
        console.log('TOKEN: ', token)

        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified,
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Server Error', error: err.message
        })
    }
}

const login = async (req, res) => {
    try {
        console.log("Login function called!")
        const { phone, password, role } = req.body

        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password required' })
        }

        const existingUser = await user.findOne({ phone })
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        if(existingUser.role !== role) {
            return res.status(400).json({message: 'Not valid for this role'})
        }
        if (existingUser.isBanned) {
            return res.status(403).json({ message: 'Account banned' })
        }

        const isMatch = await existingUser.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(existingUser._id)
        console.log('TOKEN ', token)

        res.status(200).json({
            token,
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                phone: existingUser.phone,
                email: existingUser.email,
                role: existingUser.role,
                isVerified: existingUser.isVerified,
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const getMe = async (req, res) => {
    res.status(200).json(req.user)
}

module.exports = { register, login, getMe }