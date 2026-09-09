const mongoose = require('mongoose')

const attendeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventTitle: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  ticketType: String,
  ticketCode: { type: String, unique: true, required: true },
  status: { type: String, enum: ['registered', 'checked-in', 'cancelled'], default: 'registered' },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date,
  paymentStatus: { type: String, enum: ['successful', 'pending', 'failed'], default: 'pending' },
  amount: { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Attendee', attendeeSchema)