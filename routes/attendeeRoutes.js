const express = require('express')
const router = express.Router()
const c = require('../controllers/attendeeController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/', protect, authorize('admin'), c.getAll)
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), c.getByEvent)
router.post('/register', c.register)
router.post('/check-in', protect, authorize('organizer', 'admin'), c.checkIn)

module.exports = router