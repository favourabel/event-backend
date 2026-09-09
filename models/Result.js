const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  examTitle: String,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  score: Number,
  totalPoints: Number,
  percentage: Number,
  passed: Boolean,
  completionTime: String,
  attemptNumber: Number,
  answers: [mongoose.Schema.Types.Mixed],
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Result', resultSchema)