const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')

// Import base routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const tweetRouter = require('./routes/tweets');

// Database configuration
const host = 'localhost';
const dbName = 'unict-innovation';

const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'test') {
  dbName = 'unict-innovation-test';
}

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://'+ host + '/' + dbName);

const db = mongoose.connection;
db.on('error', function() {
  console.error('Connection error!')
});
db.once('open', function() {
  console.log('DB connection Ready');
});

// Init express app
const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// Enable CORS
app.use(cors())

// Setup logger and body parser
app.use(morgan('dev'));
app.use(bodyParser.json());

// Setup static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Setup base routes
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/tweets', tweetRouter);

// Catch 404 errors
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;