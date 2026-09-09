const User = require('../models/User')
const Event = require('../models/Event')
const Attendee = require('../models/Attendee')
const Transaction = require('../models/Transaction')

exports.getStats = async (req, res) => {
  try {
    const [organizers, events, participants, txns] = await Promise.all([
      User.countDocuments({ role: 'organizer' }),
      Event.countDocuments(),
      Attendee.countDocuments(),
      Transaction.find({ status: 'successful' }),
    ])

    res.json({
      totalOrganizers: organizers,
      totalEvents: events,
      totalParticipants: participants,
      totalRevenue: txns.reduce((s, t) => s + t.amount, 0),
      totalPlatformFees: txns.reduce((s, t) => s + t.platformFee, 0),
      totalPayouts: txns.reduce((s, t) => s + t.organizerPayout, 0),
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organizer' }).select('-password')
    
    // Format organizers with default fallback values for revenue & events
    const formattedOrganizers = organizers.map(o => ({
      ...o.toObject(),
      organization: o.organization || o.name,
      eventsCreated: o.eventsCreated || 0,
      totalAttendees: o.totalAttendees || 0,
      totalRevenue: o.totalRevenue || 0,
      joinedAt: o.createdAt || new Date(),
    }))

    res.json(formattedOrganizers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}