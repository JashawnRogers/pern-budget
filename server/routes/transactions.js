const express = require('express')
const router = express.Router()

const transactionsController = require('../controller/transactionsController')

router.post('/create-transaction', transactionsController.createTransaction)

module.exports = router