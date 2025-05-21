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

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})


// MIDDLEWARE
// To communicate with client
app.use(express.json())
// To enable cross site communication
app.use(cors({
    origin: 'http://localhost:5173',
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
        secure: false,
        sameSite: 'lax',
        maxAge: 60000 * 60 * 24
    },
}))
// ROUTES
app.use('/api/user', userRoute)
app.use('/api/transactions', transactionsRoute)
app.use('/api/budget', budgetsRoute)
app.use('/api/savings', savingsGoalsRoute)

app.listen(8001, () => {
    console.log('Server is listening on port 8001')
})