const crypto = require('crypto')
const Attendee = require('../models/Attendee')

// Helper function to generate ticket codes
const generateTicketCode = () =>
  'EVT-' + crypto.randomBytes(4).toString('hex').toUpperCase()

// 1. PUBLIC: Register/Buy ticket for an event
exports.register = async (req, res) => {
  try {
    const ticketCode = generateTicketCode()
    const attendee = await Attendee.create({
      ...req.body,
      ticketCode,
    })
    res.status(201).json(attendee)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 2. PROTECTED: Get logged-in attendee's tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Attendee.find({ email: req.user.email.toLowerCase() })
      .populate('eventId')
      .sort('-createdAt')

    res.json(tickets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 3. PROTECTED: Complete payment for a ticket (ADDED)
exports.completePayment = async (req, res) => {
  try {
    const { ticketType, amount } = req.body

    const attendee = await Attendee.findOne({
      _id: req.params.id,
      email: req.user.email.toLowerCase(),
    })

    if (!attendee) {
      return res.status(404).json({ message: 'Registration not found or unauthorized' })
    }

    attendee.ticketType = ticketType || attendee.ticketType
    attendee.amount = amount ?? attendee.amount
    attendee.paymentStatus = 'successful'
    await attendee.save()

    res.json(attendee)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 4. PROTECTED: Get all attendees (Organizer/Admin)
exports.getAll = async (req, res) => {
  try {
    const attendees = await Attendee.find().sort('-createdAt')
    res.json(attendees)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Organizer verifies and checks in an attendee
exports.checkIn = async (req, res) => {
  try {
    const { ticketCode } = req.body;
    if (!ticketCode) {
      return res.status(400).json({ message: 'Ticket code is required' });
    }

    // Find attendee by ticket code
    const attendee = await Attendee.findOne({ ticketCode: ticketCode.trim().toUpperCase() })
      .populate('eventId', 'title date venue location');

    if (!attendee) {
      return res.status(404).json({ message: 'Invalid ticket code. No registration found.' });
    }

    // Check if already checked in
    if (attendee.checkedIn) {
      return res.status(400).json({
        message: `Already checked in at ${new Date(attendee.checkedInAt).toLocaleTimeString()}`,
        attendee,
      });
    }

    // Check if payment is confirmed
    if (attendee.paymentStatus !== 'successful') {
      return res.status(400).json({
        message: 'Payment pending! Ticket is not yet confirmed.',
        attendee,
      });
    }

    // Mark as checked-in
    attendee.checkedIn = true;
    attendee.checkedInAt = new Date();
    attendee.status = 'checked-in';
    await attendee.save();

    res.json({
      message: 'Check-in successful! Welcome to the event.',
      attendee,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};