const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  reference: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  eventTitle: String,
  ticketType: String,
  amount: Number,
  platformFee: Number,
  organizerPayout: Number,
  status: { type: String, enum: ['successful', 'pending', 'failed'], default: 'pending' },
  paymentMethod: String,
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)