const express = require('express')
const router = express.Router()
const c = require('../controllers/attendeeController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Public: Register for an event
router.post('/register', c.register)

// Protected (Attendee): Get my tickets for dashboard
router.get('/me/tickets', protect, c.getMyTickets)

// Protected (Attendee): Complete payment on my ticket
router.put('/:id/pay', protect, c.completePayment)

// Protected (Organizer/Admin): Get all attendees
router.get('/check-in', protect, authorize('organizer', 'admin'), c.checkIn)

module.exports = router