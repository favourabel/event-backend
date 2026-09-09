const Exam = require('../models/Exam')
const Result = require('../models/Result')

// CREATE exam
exports.create = async (req, res) => {
  try {
    const exam = await Exam.create(req.body)
    res.status(201).json(exam)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET exams by event
exports.getByEvent = async (req, res) => {
  try {
    const exams = await Exam.find({ eventId: req.params.eventId })
    res.json(exams)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET exam by id
exports.getById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
    if (!exam) return res.status(404).json({ message: 'Exam not found' })
    res.json(exam)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// SUBMIT exam
exports.submit = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
    if (!exam) return res.status(404).json({ message: 'Exam not found' })

    const { answers } = req.body || {}
    if (!answers) {
      return res.status(400).json({ message: 'Answers are required' })
    }

    let score = 0

    exam.questions.forEach((q, i) => {
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (answers[i] === q.correctAnswer) score += q.points
      } else if (q.type === 'short-answer') {
        if (q.keywords?.some((k) => String(answers[i] || '').toLowerCase().includes(k))) {
          score += q.points
        }
      } else {
        if (String(answers[i] || '').length > 50) score += q.points * 0.7
        else if (String(answers[i] || '').length > 20) score += q.points * 0.5
      }
    })

    const totalPoints = exam.questions.reduce((s, q) => s + q.points, 0)
    const percentage = Math.round((score / totalPoints) * 100)
    const passed = percentage >= exam.passingScore

    const result = await Result.create({
      userId: req.user._id,
      userName: req.user.name,
      examId: exam._id,
      examTitle: exam.title,
      eventId: exam.eventId,
      score,
      totalPoints,
      percentage,
      passed,
      answers,
      attemptNumber: 1,
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}