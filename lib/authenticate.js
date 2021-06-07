
module.exports.isAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()) {  // 認証済
        console.log('認証成功')
        console.log(req.user)
        return next();
    }
    else {  // 認証されていない
        console.log('認証失敗')
        res.redirect('/');  // ログイン画面に遷移
    }
}