const express = require('express')
const friendsController = require('../controllers/friends.controller')

const router = express.Router();

router.post('/request/:id',friendsController.request)
router.post('/accept',friendsController.accept)
router.post("/search",friendsController.search)
router.post('/remove',friendsController.remove)



module.exports = router