const File = require('../models/File')
const cloudinary = require('cloudinary').v2

//localFileUpload --> Handler Function

exports.localFileUpload = async (req, res) => {
    try{
        // fetch file
        const file = req.files.file
        console.log('File appeared', file)

        // path for local storage
        const path = __dirname + '/files' + Date.now() + `.${file.name.split('.')[1]}`
        console.log('PATH -->', path)

        // add path to the move function
        file.mv(path, (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({
                    success: false,
                    message: 'Unable to save file locally'
                })
            }

            res.json({
                success: true,
                message: 'Local file uploaded successfully',
            })
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong while uploading locally',
        })
    }
}

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type)
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder }
    console.log('temp file path', file.tempFilePath)
    //if theres a valid inputin quality then include it in options
    if(quality) {
        options.quality = quality
    }
    options.resource_type = 'auto'
    return cloudinary.uploader.upload(file.tempFilePath, options)
}

//image upload handler
exports.imageUpload = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body
        console.log(name, tags, email)

        const file = req.files.imageFile
        console.log(file)

        //validation
        const supportedTypes = ['jpg', 'jpeg', 'png']
        const fileType = file.name.split('.')[1].toLowerCase()

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false, 
                message: 'File format not supported'
            })
        }

        //file format supported
        console.log('uploading to codehelp')
        const response = await uploadFileToCloudinary(file, 'Codehelp')
        console.log(response)

        //db me entry save karni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image successfully uploaded'
        })

    } catch (err) {
        console.error(err)
        res.status(400).json({
            success: false,
            message: 'Something went wrong',
        })
    }
} 

//video upload handler

exports.videoUpload = async (req,res) => {
    try{
        const { name, tags, email } = req.body
        const file = req.files.videoFile
        console.log('File appeared', file)

        //added a safety check for missing videoFile
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided'
            })
        }

        //validation
        const supportedTypes = ['mp4', 'mov']
        const fileType = file.name.split('.')[1].toLowerCase()

        //H/W: Add a upper limit of 5MB for video
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false, 
                message: 'File format not supported'
            })
        }
         //file format supported
        console.log('uploading to codehelp')
        const response = await uploadFileToCloudinary(file, 'Codehelp')
        console.log(response)

        //db me entry save karni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Video successfully uploaded'
        })

    } catch (err) {
        console.error(err)
        res.status(400).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

//imageSizereducer
    exports.imageSizeReducer = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body
        console.log(name, tags, email)

        const file = req.files.imageFile
        console.log(file)

        //validation
        const supportedTypes = ['jpg', 'jpeg', 'png']
        const fileType = file.name.split('.')[1].toLowerCase()

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false, 
                message: 'File format not supported'
            })
        }

        //file format supported
        console.log('uploading to codehelp')
        //H/W: compress the image by using height attribute
        const response = await uploadFileToCloudinary(file, 'Codehelp', 30)
        console.log(response)

        //db me entry save karni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image successfully uploaded'
        })

    }catch(error){
        console.error(err)
        res.status(400).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}