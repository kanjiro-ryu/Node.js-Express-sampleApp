var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' , comment: 'Node.js & Express & MongoDB'});
  res.redirect('/home'); // 変更
});

module.exports = router;

