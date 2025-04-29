const express = require('express')
const cors = require('cors')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('./config/dbEntry')
const userRoute = require('./routes/user')
const transactionsRoute = require('./routes/transactions')
const budgetsRoute = require('./routes/budgets')
const savingsGoalsRoute = require('./routes/savings')
require('dotenv').config()

const app = express()


// MIDDLEWARE
// To communicate with client
app.use(express.json())
// To enable cross site communication
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
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