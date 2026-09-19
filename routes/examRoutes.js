const express = require('express')
const router = express.Router()
const c = require('../controllers/examController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Organizer Routes
router.post('/', protect, authorize('organizer', 'admin'), c.create)
router.get('/organizer/:organizerId', protect, authorize('organizer', 'admin'), c.getByOrganizer)
router.put('/:id', protect, authorize('organizer', 'admin'), c.update)

// Attendee Routes
router.get('/event/:eventId', protect, c.getByEvent)
router.get('/:id', protect, c.getById)

// ✅ FIXED: Changed /:id/submitExam to /:id/submit
router.post('/:id/submit', protect, c.submitExam)

module.exports = router