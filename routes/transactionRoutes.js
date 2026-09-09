const express = require('express')
const router = express.Router()
const c = require('../controllers/transactionController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/', protect, authorize('admin'), c.getAll)
router.get('/organizer/:organizerId', protect, authorize('organizer', 'admin'), c.getByOrganizer)

module.exports = router