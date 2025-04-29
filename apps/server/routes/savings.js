const express = require('express')
const router = express.Router()
const savingsController = require('../controller/savingsController')

router.post('/create', savingsController.createSavingsGoal)
router.put('/update', savingsController.updateSavingsGoal)
router.delete('/delete/:id', savingsController.deleteSavingsGoal)
router.get('/get-savings-goal/:id', savingsController.getSavingsGoal)
router.get('/get-all-savings-goals', savingsController.getAllSavingsGoals)

module.exports = router