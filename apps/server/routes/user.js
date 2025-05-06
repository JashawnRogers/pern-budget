const express = require('express')
const router = express.Router()
const upload = require('../helpers/upload')

const userController = require('../controller/userController')

router.post('/register', userController.signUp)
router.post('/login', userController.logIn)
router.delete('/delete/:id', userController.deleteUser)
router.get('/logout', userController.logout)
router.get('/session', userController.getSession)
router.get('/income', userController.getMonthlyIncome)
router.put('/income/update', userController.updateMonthlyIncome)
router.put('/upload-profile-image', upload.single('profileImage'), userController.uploadProfileImage )
router.put('/update-email', userController.updateEmail)
router.put('/update-password', userController.updatePassword)
router.put('/update-name', userController.updateName)



module.exports = router