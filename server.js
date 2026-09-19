require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const { connectCloudinary } = require('./config/cloudinary')
const errorHandler = require('./middleware/errorHandler');
const resultRoutes = require('./routes/resultRoutes');

// Connect DB
connectDB()

// Connect Cloudinary
connectCloudinary()

const app = express()

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health check
app.get('/', (req, res) => res.json({ message: '🚀 EventApp API is running' }))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/events', require('./routes/eventRoutes'))
app.use('/api/attendees', require('./routes/attendeeRoutes'))
app.use('/api/exams', require('./routes/examRoutes'))
app.use('/api/results', require('./routes/resultRoutes')) // 👈 Updated for consistency
app.use('/api/certificates', require('./routes/certificateRoutes'))
app.use('/api/transactions', require('./routes/transactionRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/announcements', require('./routes/announcementRoutes'))
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))