const express = require('express')
const friendsController = require('../controllers/friends.controller')
const authenticateUser = require('../middlewares/auth')

const router = express.Router();

router.post('/request/:id',authenticateUser,friendsController.request)
router.post('/accept',authenticateUser,friendsController.accept)
router.post("/search",authenticateUser,friendsController.search)
router.post('/remove',authenticateUser,friendsController.remove)



module.exports = router