const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Create upload folder if it is missing for whatever reason
const uploadDir = path.join('uploads', 'profile_images')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir) // set location of where to save file
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) // Get .png .jpg etc.
        const filename = `${Date.now()}-${file.fieldname}${ext}` // Create filenames with timestamps to prevent duplicates
        cb(null, filename)
    }
})

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)
    
    if(extname && mimeType) {
        cb(null, true)
    } else {
        cb(new Error('Only .jpeg, .jpg, and .png files are allowed'))
    }
}

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // limits file size to 5MB
})

module.exports = upload