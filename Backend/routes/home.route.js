const express = require('express')
const homeController = require('../controllers/home.controller')

const router = express.Router();

router.post('/register',homeController.register)
router.post('/login',homeController.login)
router.post('/logout',homeController.logout)



module.exports = router