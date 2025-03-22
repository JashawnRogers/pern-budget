const express = require('express')
const router = express.Router()
const budgetsController = require('../controller/budgetsController')

router.post('/create', budgetsController.createBudget)
router.put('/update', budgetsController.updateBudget)



module.exports = router