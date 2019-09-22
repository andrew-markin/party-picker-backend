const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const server = express();
server.use(morgan('dev'));
server.use(bodyParser.json());

server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  else return next();
});

server.use('/', require('./routes/public'));

// Favicon request handler
server.get('/favicon.ico', function(_req, res) {
  res.sendStatus(204);
});

// Catch 404 and forward to error handler
server.use(function(_req, _res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

// Error handler
server.use(function(err, _req, res, _next) {
  console.error('Error:', err);
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message
  });
});

// Start application

var mongooseConnectOptions = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  socketTimeoutMS: 0,
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
  mongooseConnectOptions.auth = {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD
  };
}

mongoose.connect(process.env.MONGODB_URL, mongooseConnectOptions, function(err, db) {
  if (err) {
    console.error('Unable to connect database:', err.message);
    return process.exit(1);
  }
  console.log('Database connected...');
  server.listen(process.env['app_port'] || process.env.PORT || 3000, function(err) {
    if (err) {
      console.error('Unable to start server', err.message);
      return process.exit(2);
    }
    console.log('Server started...');
  });
});

process.on('SIGINT', function() {
  console.log( '\nShutting down...' );
  process.exit(0);
});
