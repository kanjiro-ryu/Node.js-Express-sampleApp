const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController')

router.get('/', tweetController.getAllTweets)
router.post('/create', tweetController.createTweets)

module.exports = router