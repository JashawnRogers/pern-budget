const express = require('express')
const router = express.Router()
const budgetsController = require('../controller/budgetsController')

router.post('/create', budgetsController.createBudget)
router.put('/update', budgetsController.updateBudget)
router.delete('delete/:id', budgetsController.deleteBudget)
router.get('/get-budget/:category', budgetsController.getBudget)
router.get('/get-all-budgets', budgetsController.getAllBudgets)


module.exports = router