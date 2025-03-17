const express = require('express')
const cors = require('cors')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('./config/dbEntry')
const userRoute = require('../server/routes/user')
const transactionsRoute = require('../server/routes/transactions')
require('dotenv').config()

const app = express()


// MIDDLEWARE
// To communicate with client
app.use(express.json())
// To enable cross site communication
app.use(cors())
//session
app.use(session({
    store: new pgSession({
        pool,
        tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 * 60 * 24 }
}))
// ROUTES
// Whatever code is stored in userRoute will be accessable through the /user endpoint
app.use('/user', userRoute)
app.use('/transactions', transactionsRoute)


app.listen(8000, () => {
    console.log('Server is listening on port 8000')
})