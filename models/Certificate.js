const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  verificationId: { type: String, unique: true, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  eventTitle: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  issueDate: { type: Date, default: Date.now },
  type: { type: String, enum: ['attendance', 'completion'], default: 'attendance' },
  examScore: Number,
  organizerName: String,
}, { timestamps: true })

module.exports = mongoose.model('Certificate', certificateSchema)