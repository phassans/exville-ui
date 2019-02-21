var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let helpers = require('./helpers/helper');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var toggleRouter = require('./routes/toggle');
var uploadRouter = require('./routes/upload');
var deleteRouter = require('./routes/delete');
var singupRouter = require('./routes/singup');
var refreshRouter = require('./routes/refresh');

var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// view engine setup
let config = require('./config');
let hbs = require('hbs');
hbs.registerHelper(helpers);
hbs.registerPartials(config.dirname + '/views/partials/');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret_key_viraagh'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/toggle', toggleRouter);
app.use('/upload', uploadRouter);
app.use('/delete', deleteRouter);
app.use('/signup', singupRouter);
app.use('/refresh', refreshRouter);

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
