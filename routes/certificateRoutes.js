const express = require('express')
const router = express.Router()
const c = require('../controllers/certificateController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Create certificate (so you can get a real verificationId)
router.post('/', protect, authorize('organizer', 'admin'), c.create)

// Existing public/read routes
router.get('/user/:userId', c.getByUser)
router.get('/event/:eventId', c.getByEvent)
router.get('/verify/:verificationId', c.verify)

module.exports = router