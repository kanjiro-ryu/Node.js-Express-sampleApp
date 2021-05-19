var express = require('express');
var router = express.Router();

var homeController = require('../controllers/homeController'); // 追加

router.get('/', homeController.index)

module.exports = router;