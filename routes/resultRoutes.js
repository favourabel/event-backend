const express = require('express');
const router = express.Router();
const c = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get results for logged in attendee
router.get('/user/:userId', protect, c.getByUser);

// Get all results for an exam (organizer/admin)
router.get('/exam/:examId', protect, authorize('organizer', 'admin'), c.getByExam);

module.exports = router;