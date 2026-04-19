const Notification = require('../models/Notification')
const sendPushNotification = require('../utils/pushNotification')
const sendSMS = require('../utils/smsNotification')
const axios = require('axios')

const sendNotification = async (req, res) => {
    try {
        const {
            recipientId,
            recipientRole,
            title,
            message,
            type,
            channels = { push: false, sms: false, inApp: true },
            refId = null,
            refModel = null,
            fcmToken = null,
            phone = null,
        } = req.body
        
        if (!recipientId || !recipientRole || !title || !message ||!type){
            return res.status(400).json({
                message: 'Missing required fields'
            })
        }

        const notification = await Notification.create({
            recipient: {id: recipientId, role: recipientRole},
            title, message, type, channels, refId, refModel,
        })

        if(channels.push && fcmToken) {
            await sendPushNotification(fcmToken, title, message)
        }
        if(channels.sms && phone){
            await sendSMS(phone, `${title}: ${message}`)
        }

        res.status(201).json({
            message: 'Notification sent', notification
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const getMyNotification = async (req, res) => {
    try{
        const {page = 1, limit = 20, unreadOnly} = req.query
        const filter = {'recipient.id': req.user._id.toString()}
        if(unreadOnly === 'true') filter.isRead = false
         
        const skip = (Number(page) -1) * Number(limit)
        const total = await Notification.countDocuments(filter)
        const notifications = await Notification.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(Number(limit))
        
        const unreadCount = await Notification.countDocuments({
            'recipient.id': req.user._id.toString(),
            isRead: false,
        })

        res.status(200).json({
            total, unreadCount, page: Number(page), pages: Math.ceil(total/Number(limit)),
            notifications,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const markAsRead = async( req, res) => {
    try{
        const notification = await Notification.findById(req.params.id)
        if(!notification) {
            return res.status(404).json({
                message: 'Notification not found'
            })
        }

        if(notification.recipient.id !== req.user._id.toString()){
            return res.status(403).json({
                message: 'Not authorized'
            })
        }

        notification.isRead = true
        await notification.save()

        res.status(200).json({
            message: 'Mark as read', notification
        })
    } catch(error){
        res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const markAllAsRead = async (req, res) => {
    try{
        await Notification.updateMany({
            'recipient.id': req.user._id.toString(), isRead: false
        },{isRead: true})
        res.status(200).json({
            message: 'All notifications marked as read'
        })
    } catch (error){
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const deleteNotification = async (req, res) =>  {
    try {
        const notification = await Notification.findById(req.params.id)
        if(!notification) {
            return res.status(404).json({
                message: 'Notification not found'
            })
        }

        if(notification.recipient.id !== req.user._id.toString()){
            return res.status(403).json({
                message: 'Not authorized'
            })
        }
        
        await notification.deleteOne()
    } catch (error) {
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

const broadcast = async(req, res) => {
    try {
        const {title, message, targetRole, recipientIds} = req.body
        if(!title || !message) {
            return res.status(400).json({
                message: 'Title and message required'
            })
        }

        let users = []
        if( recipientIds && recipientIds.length > 0 ){
            users = recipientIds.map((id) => ({
                _id: id, role: targetRole || 'all'
            }))
        } else {
            try{
                const query = targetRole ? `?role=${targetRole}` : ''
                const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/profile/all${query}`,{
                    headers: {Authorization: req.headers.authorization}
                })
                users = response.data
            } catch (error) {
                return res.status(500).json({
                    message: 'Failed to fetch users for broascast'
                })
            }
        }

        const notifications = users.map((user) =>({
            recipient: {id: user._id.toString(), role: user.role},
            title, message, type: 'broadcast', channels: {push: false, sms: false, inApp: true},
        }))

        await Notification.insertMany(notifications)

        res.status(201).json({
            message: `Broadcast sent to ${notifications.length} users`
        })
    } catch(error){
        return res.status(500).json({
            message: 'Server error', error: error.message
        })
    }
}

module.exports = {sendNotification, getMyNotification, markAsRead, markAllAsRead, deleteNotification, broadcast}