const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    mongoose = require('mongoose'),
    methodOverride = require("method-override"),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express();

mongoose.connect('mongodb://localhost:27017/test_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.Promise = global.Promise

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method")); //ルーティングの前に書く


const session = require('express-session');
app.use(session({
  secret: 'cookie_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/users');
passport.use(new LocalStrategy({
  userNameField:'username',
  passwordField:'password',
  passReqToCallback: false,
  session: false,//ここfalseでLogin処理時にsessionを有効?
},function(username, password, done){
  //ここで username と password を確認して結果を返す
  console.log(username)
  console.log(password)
  User.findOne({ name: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) return done(null, false, { message: 'ユーザーIDが正しくありません。' });
    if( user.password !== password ) return done(null, false, {message: 'パスワードが正しくありません'})
    // if (!user.validPassword(password)) {
    //   return done(null, false, { message: 'パスワードが正しくありません。' });
    // }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  console.log('シリアライズ')
  console.log(user)
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('デシリアライズ')
  console.log(user)
  done(null, user);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
