const express = require('express')
const router = express.Router()
const c = require('../controllers/examController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Create exam (organizer/admin)
router.post('/', protect, authorize('organizer', 'admin'), c.create)

// Get exams by event
router.get('/event/:eventId', c.getByEvent)

// Get one exam
router.get('/:id', c.getById)

// Submit exam (logged in)
router.post('/:id/submit', protect, c.submit)

module.exports = router