const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// Function to log connection on server startup
const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('❌ Cloudinary Error: Missing Cloudinary keys in .env')
      return
    }

    console.log(`✅ Cloudinary Connected: ${process.env.CLOUDINARY_CLOUD_NAME}`)
  } catch (error) {
    console.error(`❌ Cloudinary Error: ${error.message}`)
  }
}

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'eventapp',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
})

// Multer upload middleware
const upload = multer({ storage })

// Delete image helper
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (err) {
    console.error('Cloudinary delete error:', err.message)
    return false
  }
}

// 👉 CRITICAL: Export connectCloudinary along with upload and deleteImage
module.exports = { cloudinary, upload, deleteImage, connectCloudinary }