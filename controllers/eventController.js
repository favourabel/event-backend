const Event = require('../models/Event')

exports.getAll = async (req, res) => {
  try {
    const { category, search } = req.query
    let query = { status: 'published' }
    if (category && category !== 'all') query.category = category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ]
    }
    const events = await Event.find(query).sort('-createdAt')
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.params.organizerId })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.user._id,
      organizerName: req.user.organization || req.user.name,
    })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}