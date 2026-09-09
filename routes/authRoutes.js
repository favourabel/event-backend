const express = require('express')
const router = express.Router()
const c = require('../controllers/authController')

router.post('/register', c.register)
router.post('/login', c.login)
router.post('/forgot-password', c.forgotPassword)
router.post('/reset-password', c.resetPassword)

module.exports = router