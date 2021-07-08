var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

//Mongooseの導入
var mongoose = require('mongoose');
var constants = require('./lib/constants');
mongoose.connect(constants.DB_URL + constants.DB_NAME, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// // 追加
// var methodOverride = require('method-override')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var todoRouter = require('./routes/todo');
var app = express();


// var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect(
//     'mongodb://127.0.0.1:27017/express-todo-tutorial',
//     { useNewUrlParser: true },
//     function(err, client) {
//       console.log("Connected successfully to DB");
//       client.close();
//     }
// );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));


// body-parserの設定
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 追加
// app.use(methodOverride('_method'))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/todo', todoRouter);

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
