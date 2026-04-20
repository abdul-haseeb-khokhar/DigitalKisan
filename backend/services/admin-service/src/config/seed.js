const Admin = require('../models/Admin')

const seedAdmin = async() =>
{
    try{
        const existing = await Admin.findOne({email: 'admin@digitalkisan.com'})
        if(existing) return

        await Admin.create({
            name: 'Super Admin',
            email:'admin@digitalkisan.com',
            password: 'admin123456',
            isSuperAdmin: true,
        })

        console.log('Default admin created: admin@digitalkisan / admin123456')
    } catch (error) {
        console.error('Admin seed failed: ', error.message)
    }
}

module.exports = seedAdmin