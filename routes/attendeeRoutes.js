const express = require('express')
const router = express.Router()
const c = require('../controllers/attendeeController')
const { protect, authorize } = require('../middleware/authMiddleware')

// 1. Public: Register for an event
router.post('/register', c.register)

// 2. Protected (Attendee): Get my tickets for dashboard
router.get('/me/tickets', protect, c.getMyTickets)

// 3. Protected (Attendee): Complete payment on my ticket
router.put('/:id/pay', protect, c.completePayment)

// 4. Protected (Organizer/Admin): Check in an attendee (MUST BE POST!)
router.post('/check-in', protect, authorize('organizer', 'admin'), c.checkIn)

// 5. Protected (Organizer/Admin): Get all attendees
router.get('/', protect, authorize('organizer', 'admin'), c.getAll)

module.exports = router