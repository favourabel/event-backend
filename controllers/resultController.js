const Result = require('../models/Result');

// 1. GET RESULTS BY USER ID (For Attendee Dashboard)
exports.getByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Finds results matching the user's ID or email
    const results = await Result.find({
      $or: [
        { userId: userId },
        { email: req.user?.email?.toLowerCase() }
      ]
    }).sort('-createdAt');

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. GET RESULTS BY EXAM ID (For Organizer / Admin Dashboard)
exports.getByExam = async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId }).sort('-createdAt');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};