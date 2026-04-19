const sendSMS = async (phone, message) => {
    if(process.env.TWILIO_ACCOUNT_SID ==='mock') {
        console.log(`[MOCK SMS] to: ${phone} | message: ${message}`)
        return {success: true, mock: true}
    }

    {/*
        real twillio call goes here
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        await client.message.create({
        body: Message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
        })
    */}

    return {success: true}
}

module.exports = sendSMS