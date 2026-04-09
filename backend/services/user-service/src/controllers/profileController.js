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

module.exports = { updateProfile, getUserById, updateFcmToken }