const sendPushNotification = async (fcmToken, title, message) => {
    if( !fcmToken || process.env.FCM_SERVER_KEY === 'mock'){
        console.log(`[MOCK PUSH] to : ${fcmToken} | Title: ${title} | Message: ${message}`)
        return { success: true, mock: true}
    }

    {/*
        real FCM call goes here
        const response = await axios.post('https://fcm.googleapis.com/fcm/send, {
        to: fcmToken,
        notification: {title, body: message}
        }, {
            headers: {Authorization: `key=${process.env.FCM_SERVER_KEY}`
        }
        )}
    */}
    
    return {sucess: true}
        
}
module.exports = sendPushNotification