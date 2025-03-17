const express = require('express')
const router = express.Router()

const transactionsController = require('../controller/transactionsController')

router.get('/', transactionsController.getTransactions)
router.post('/create-transaction', transactionsController.createTransaction)
router.put('/update-transaction/:id', transactionsController.updateTransaction)
router.delete('/delete/:id', transactionsController.deleteTransaction)

module.exports = router