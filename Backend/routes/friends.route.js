const express = require('express')
const friendsController = require('../controllers/friends.controller')
const authenticateUser = require('../middlewares/auth')

const router = express.Router();

router.post('/request/:id',authenticateUser,friendsController.request)
router.post('/accept/:id',authenticateUser,friendsController.accept)
router.post('/decline',authenticateUser,friendsController.decline)
router.get("/all",authenticateUser,friendsController.all)
router.post('/remove',authenticateUser,friendsController.remove)



module.exports = router