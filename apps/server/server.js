const express = require('express')
const cors = require('cors')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('./config/dbEntry')
const userRoute = require('./routes/user')
const transactionsRoute = require('./routes/transactions')
const budgetsRoute = require('./routes/budgets')
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
    store: new pgSession({
        pool,
        tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { 
        maxAge: 60000 * 60 * 24,
        httpOnly: true,
        secure: process.env.SECURE,
        sameSite: 'lax'
    },
}))
// ROUTES
// Whatever code is stored in userRoute will be accessable through the /user endpoint
app.use('/api/user', userRoute)
app.use('/api/transactions', transactionsRoute)
app.use('/api/budget', budgetsRoute)


app.listen(8000, () => {
    console.log('Server is listening on port 8000')
})