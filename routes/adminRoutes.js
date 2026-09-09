const express = require('express')
const router = express.Router()
const c = require('../controllers/adminController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/stats', protect, authorize('admin'), c.getStats)
router.get('/organizers', protect, authorize('admin'), c.getOrganizers)

module.exports = router