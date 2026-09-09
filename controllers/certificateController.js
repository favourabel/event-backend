const Certificate = require('../models/Certificate')
const crypto = require('crypto')

// Generate verification ID like CERT-A1B2C3D4
const generateVerificationId = () => {
  return 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase()
}

// POST /api/certificates — create certificate (to get a real verificationId for testing)
exports.create = async (req, res) => {
  try {
    const {
      eventId,
      eventTitle,
      userId,
      userName,
      type,
      examScore,
      organizerName,
    } = req.body || {}

    if (!eventId || !userName) {
      return res.status(400).json({
        message: 'eventId and userName are required',
      })
    }

    const certificate = await Certificate.create({
      verificationId: generateVerificationId(),
      eventId,
      eventTitle: eventTitle || '',
      userId: userId || null,
      userName,
      type: type || 'completion',
      examScore: examScore ?? null,
      organizerName: organizerName || '',
      issueDate: new Date(),
    })

    res.status(201).json(certificate)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getByUser = async (req, res) => {
  try {
    const certs = await Certificate.find({ userId: req.params.userId })
    res.json(certs)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getByEvent = async (req, res) => {
  try {
    const certs = await Certificate.find({ eventId: req.params.eventId })
    res.json(certs)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.verify = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ verificationId: req.params.verificationId })
    if (!cert) return res.status(404).json({ message: 'Certificate not found' })
    res.json({ ...cert.toObject(), verified: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
}