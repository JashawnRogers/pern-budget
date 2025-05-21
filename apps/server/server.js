const express = require('express')
const cors = require('cors')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('./config/dbEntry')
const userRoute = require('./routes/user')
const transactionsRoute = require('./routes/transactions')
const budgetsRoute = require('./routes/budgets')
const savingsGoalsRoute = require('./routes/savings')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8001
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.PREVIEW_URL,
    process.env.LOCAL_URL
]

// MIDDLEWARE
// To communicate with client
app.use(express.json())
// To enable cross site communication
app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl) or from the whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
}))

// Catches multer errors to ensure safe image uploads to server
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer error', error: err.message })
    } else if (err) {
        return res.status(400).json({ message: 'File upload error', error: err.message })
    }

    next(err)
})
// Serves files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//session
app.use(session({
    store: new pgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60000 * 60 * 24
    },
}))
// ROUTES
app.use('/api/user', userRoute)
app.use('/api/transactions', transactionsRoute)
app.use('/api/budget', budgetsRoute)
app.use('/api/savings', savingsGoalsRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `)
})