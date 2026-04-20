const User = require('../models/user')

const updateProfile = async (req, res) => {
    try{
        const {name, email, city, lat, lng, profilePhoto, fcmToken} = req.body
        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        if(name) user.name = name
        if(email) user.email = email
        if(profilePhoto) user.profilePhoto = profilePhoto
        if(fcmToken) user.fcmToken = fcmToken
        if(city || lat || lng){
            user.location = {
                city: city|| user.location.city,
                coordinates: {
                    lat: lat || user.location.coordinates.lat,
                    lng: lng || user.location.coordinates.lng,
                },
            }
        }

        const updated = await user.save()

        res.status(200).json({
            _id: updated._id,
            name: updated.name,
            phone: updated.phone, 
            email: updated.email,
            role: updated.role,
            isVerified: updated.isVerified,
            location: updated.location,
            profilePhoto: updated.profilePhoto,
        })
    } catch(error){
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password -fcmToken -isBanned')

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({user})

    }catch(err){
        res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}

const updateFcmToken = async(req, res) => {
    try{
        const {fcmToken} = req.body
        if(!fcmToken) {
            return res.status(404).json({
                message: 'FCM token required'
            })
        }

        await User.findByIdAndUpdate(req.user._id, {fcmToken})
        res.status(200).json({
            message: 'FCM token updated'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Server error', error: err.message
        })
    }
}

const getAllUsers = async(req, res) => {
    try{
        const {
            role, page= 1, limit = 1
        }  = req.body

        const filter = {}
        if(role) filter.role = role

        const skip = (Number(page) -1) * Number(limit)
        const total = await User.countDocuments(filter)
        const users = await User.find(filter)
            .select('-password -fcmToken')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
            total, page: Number(page), pages: Math.ceil(total/Number(limit)),
            users,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const banUser = async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if(user.isBanned) {
            return res.status(400).json({
                message: 'User is alread banned'
            })
        }

        user.isBanned = true
        await user.save()

        res.status(200).json({
            message: 'User banned successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const unbanUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if(!user.isBanned) {
            return res.status(400).json({
                message: 'User is not banned'
            })
        }

        user.isBanned = false
        await user.save()

        res.status(200).json({
            message: 'User is unbanned successfully'
        })
    } catch (error) {
        res.status(500).json({
            message:'Server error', error: error.message
        })
    }
}

const verifyUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if(user.isVerified) {
            return res.status(400).json({
                message: 'User is already verified'
            })
        }

        user.isVerified = true
        await user.save()
    } catch( error ){
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}
module.exports = { updateProfile, getUserById, updateFcmToken, getAllUsers, banUser, unbanUser, verifyUser, }