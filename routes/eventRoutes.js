const express = require('express')
const router = express.Router()
const c = require('../controllers/eventController')
const { protect, authorize } = require('../middleware/authMiddleware')
const { upload } = require('../config/cloudinary')
const Event = require('../models/Event')

// ==================== EXISTING ROUTES (unchanged) ====================
router.get('/', c.getAll)
router.get('/slug/:slug', c.getBySlug)
router.get('/organizer/:organizerId', c.getByOrganizer)
router.get('/:id', c.getById)
router.post('/', protect, authorize('organizer', 'admin'), c.create)
router.put('/:id', protect, authorize('organizer', 'admin'), c.update)

// ==================== CLOUDINARY IMAGE UPLOADS ====================

// POST /api/events/:id/cover
// Single cover image (form-data field name: "image")
router.post(
  '/:id/cover',
  protect,
  authorize('organizer', 'admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' })
      }

      const imageUrl = req.file.path

      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { coverImage: imageUrl },
        { new: true }
      )

      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }

      res.json({
        message: 'Image uploaded successfully',
        coverImage: imageUrl,
        event,
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
)

// POST /api/events/:id/gallery
// Multiple gallery images (up to 5, form-data field name: "images")
router.post(
  '/:id/gallery',
  protect,
  authorize('organizer', 'admin'),
  upload.array('images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' })
      }

      const urls = req.files.map((file) => file.path)

      res.json({
        message: 'Gallery images uploaded successfully',
        images: urls,
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
)

module.exports = router