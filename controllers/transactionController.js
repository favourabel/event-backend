const Transaction = require('../models/Transaction')

exports.getAll = async (req, res) => {
  try {
    const txns = await Transaction.find().sort('-createdAt')
    res.json(txns)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getByOrganizer = async (req, res) => {
  try {
    // Assume events have organizerId; join by eventId
    const txns = await Transaction.find().populate('eventId')
    const filtered = txns.filter(t => t.eventId?.organizerId?.toString() === req.params.organizerId)
    res.json(filtered)
  } catch (err) { res.status(500).json({ message: err.message }) }
}