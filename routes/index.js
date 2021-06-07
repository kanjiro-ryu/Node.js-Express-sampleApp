const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('login', { title: 'Login'});
});
router.post('/login', passport.authenticate('local',{
  failureRedirect: '/register',  // 失敗したときの遷移先
  successRedirect: '/tweets/', // 成功したときの遷移先
  session:true
}))

router.get('/register', (req, res,) =>{
  res.render('register',{title:'Register'})
})

module.exports = router;
