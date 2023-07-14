const express = require('express')
const chaController = require('../controllers/chat.controller')

const router = express.Router();

router.post('/send',chatController.send)
router.post('/login',authController.login)
router.post('/logout',authController.logout)



module.exports = router