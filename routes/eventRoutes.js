const express = require('express')
const router = express.Router()
const c = require('../controllers/eventController')
const { protect, authorize } = require('../middleware/authMiddleware')
const { upload } = require('../config/cloudinary')
const Event = require('../models/Event')

// ==================== PUBLIC EVENT ROUTES ====================
// GET /api/events -> Fetch all events (Homepage & Explore page)
router.get('/', c.getAll)

// GET /api/events/slug/:slug -> Fetch event by slug
router.get('/slug/:slug', c.getBySlug)

// GET /api/events/organizer/:organizerId -> Fetch events for a specific organizer
router.get('/organizer/:organizerId', c.getByOrganizer)

// GET /api/events/:id -> Fetch event by MongoDB _id
router.get('/:id', c.getById)

// ==================== PROTECTED ORGANIZER / ADMIN ROUTES ====================
// POST /api/events -> Create new event
router.post('/', protect, authorize('organizer', 'admin'), c.create)

// PUT /api/events/:id -> Update an existing event
router.put('/:id', protect, authorize('organizer', 'admin'), c.update)

// ==================== CLOUDINARY IMAGE UPLOADS ====================

// POST /api/events/:id/cover
// Upload single cover image (form-data field name: "image")
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
// Upload multiple gallery images (up to 5, form-data field name: "images")
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