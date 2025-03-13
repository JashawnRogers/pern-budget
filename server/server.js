const express = require('express')
const cors = require('cors')
const app = express()


// Middleware
 // To communicate with client
app.use(express.json())
// To enable cross site communication
app.use(cors())

app.listen(8000, () => {
    console.log('Server is listening on port 8000')
})