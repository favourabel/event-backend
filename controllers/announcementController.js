const Announcement = require('../models/Announcement')

exports.getByEvent = async (req, res) => {
  try {
    const items = await Announcement.find({ eventId: req.params.eventId }).sort('-sentAt')
    res.json(items)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const item = await Announcement.create(req.body)
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ message: err.message }) }
}