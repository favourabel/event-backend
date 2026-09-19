const Exam = require('../models/Exam')
const Result = require('../models/Result')

// 1. CREATE EXAM
exports.create = async (req, res) => {
  try {
    const examData = {
      ...req.body,
      organizerId: req.user._id || req.user.id // Link exam to organizer
    }
    const exam = await Exam.create(examData)
    res.status(201).json(exam)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 2. GET EXAMS FOR ORGANIZER DASHBOARD
exports.getByOrganizer = async (req, res) => {
  try {
    const exams = await Exam.find({ organizerId: req.params.organizerId })
      .populate('eventId', 'title date')
      .sort('-createdAt')
    res.json(exams)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 3. GET EXAM BY EVENT ID (For Attendee taking the test)
exports.getByEvent = async (req, res) => {
  try {
    const exam = await Exam.findOne({ eventId: req.params.eventId, status: 'active' })
    if (!exam) return res.status(404).json({ message: 'Exam is currently unavailable or stopped' })
    res.json(exam)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 4. GET SINGLE EXAM
exports.getById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
    if (!exam) return res.status(404).json({ message: 'Exam not found' })
    res.json(exam)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 5. UPDATE EXAM (Start / Stop / Edit)
exports.update = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(exam)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 6. SUBMIT EXAM & SAVE RESULT TO MONGODB
exports.submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const examId = req.params.id;
    const userId = req.user?._id || req.user?.id;
    const userName = req.user?.name || req.user?.fullName || 'Attendee';

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let score = 0;
    const questions = exam.questions || [];
    const totalQuestions = questions.length;

    // Grade each question safely
    questions.forEach((question, index) => {
      const userAnswer = answers ? answers[index] : null;

      const isCorrect = 
        userAnswer !== null &&
        userAnswer !== undefined &&
        (
          question.correctAnswer === userAnswer ||
          question.correctOption === userAnswer ||
          question.options?.[question.correctAnswer] === userAnswer ||
          String(question.correctAnswer) === String(userAnswer)
        );

      if (isCorrect) {
        score++;
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passingScore = Number(exam.passingScore) || 70;
    const passed = percentage >= passingScore;

    // 💾 SAVE RESULT DIRECTLY TO MONGODB DATABASE
    const savedResult = await Result.create({
      userId: userId,
      userName: userName,
      examId: exam._id,
      examTitle: exam.title || 'Assessment',
      eventId: exam.eventId,
      score: score,
      totalPoints: totalQuestions,
      totalQuestions: totalQuestions,
      percentage: percentage,
      passed: passed,
      answers: answers || [],
      submittedAt: new Date()
    });

    console.log('✅ Result saved to MongoDB with ID:', savedResult._id);

    return res.status(200).json({
      success: true,
      score,
      totalQuestions,
      percentage,
      passed,
      result: savedResult,
      message: 'Assessment graded and saved successfully',
    });
  } catch (error) {
    console.error('Error submitting exam in backend:', error);
    return res.status(500).json({ message: error.message || 'Server error submitting exam' });
  }
};