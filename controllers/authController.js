const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'attendee',
      organization: organization || null,
    })

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        avatar: user.avatar,
      },
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        avatar: user.avatar,
      },
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {}
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    res.json({ message: 'Password reset link sent to your email' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body || {}
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}