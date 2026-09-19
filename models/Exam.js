const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  instructions: String,
  duration: { type: Number, default: 30 }, // in minutes
  passingScore: { type: Number, default: 40 }, // percentage
  status: { type: String, enum: ['draft', 'active', 'stopped'], default: 'active' },
  questions: [
    {
      type: { type: String, default: 'multiple-choice' },
      question: String,
      options: [String],
      correctAnswer: String,
      points: { type: Number, default: 1 }
    }
  ],
}, { timestamps: true })

module.exports = mongoose.model('Exam', examSchema)