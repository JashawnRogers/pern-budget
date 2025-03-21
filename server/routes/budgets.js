const express = require('express')
const router = express.Router()
const budgetsController = require('../controller/budgetsController')

router.post('/create-budget', budgetsController.createBudget)

module.exports = router