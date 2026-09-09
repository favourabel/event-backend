const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: String,
  message: String,
  recipients: Number,
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Announcement', announcementSchema)