const Attendee = require('../models/Attendee')
const Event = require('../models/Event')
const crypto = require('crypto')

const generateTicketCode = () =>
  'EVT-' + crypto.randomBytes(4).toString('hex').toUpperCase()

exports.getAll = async (req, res) => {
  try {
    const attendees = await Attendee.find().sort('-createdAt')
    res.json(attendees)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getByEvent = async (req, res) => {
  try {
    const attendees = await Attendee.find({ eventId: req.params.eventId })
    res.json(attendees)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.register = async (req, res) => {
  try {
    const event = await Event.findById(req.body.eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const attendee = await Attendee.create({
      ...req.body,
      eventTitle: event.title,
      ticketCode: generateTicketCode(),
      status: 'registered',
      checkedIn: false,
    })

    event.registeredCount += 1
    await event.save()

    res.status(201).json(attendee)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.checkIn = async (req, res) => {
  try {
    const attendee = await Attendee.findOne({ ticketCode: req.body.ticketCode })
    if (!attendee) return res.status(404).json({ message: 'Invalid ticket' })
    if (attendee.checkedIn) return res.status(400).json({ message: 'Already checked in' })

    attendee.checkedIn = true
    attendee.checkedInAt = new Date()
    attendee.status = 'checked-in'
    await attendee.save()

    await Event.findByIdAndUpdate(attendee.eventId, { $inc: { checkedInCount: 1 } })

    res.json(attendee)
  } catch (err) { res.status(500).json({ message: err.message }) }
}