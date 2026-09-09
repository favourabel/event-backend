const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: String,
  instructions: String,
  duration: Number,
  totalQuestions: Number,
  passingScore: Number,
  status: { type: String, default: 'active' },
  attempts: { type: Number, default: 1 },
  questions: [Object],
}, { timestamps: true })

module.exports = mongoose.model('Exam', examSchema)