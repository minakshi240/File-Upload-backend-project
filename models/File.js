const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    tags: {
        type: String,
    },
    email: {
        type: String,
    }
})

//post middleware
fileSchema.post('save', async function(doc) {
    try {
        console.log('DOC', doc)

        //transporter
        //TODO: shift this configuration under config folder
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        //send email
        let info = await transporter.sendMail({
            from: `Mina`,
            to: doc.email,
            subject: 'New file uploaded on cloudinary',
            html: `<h2>Hello Jee</h2> File uploaded</p> View here: <a herf="${doc.imageUrl}">${doc.imageUrl}</a> <p>`, 
        })
        console.log('INFO', info)
    } catch(err) {
         console.error('Email send error:', err)
    }
})

const File = mongoose.model('File', fileSchema)
module.exports = File