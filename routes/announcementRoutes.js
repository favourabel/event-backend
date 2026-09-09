const express = require('express')
const router = express.Router()
const c = require('../controllers/announcementController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/event/:eventId', c.getByEvent)
router.post('/', protect, authorize('organizer', 'admin'), c.create)

module.exports = router