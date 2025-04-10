const express = require('express')
const router = express.Router()

const userController = require('../controller/userController')

router.post('/register', userController.signUp)
router.post('/login', userController.logIn)
router.delete('/delete/:id', userController.deleteUser)
router.get('/logout', userController.logout)
router.get('/session', userController.getSession)


module.exports = router