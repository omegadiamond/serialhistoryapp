const express = require('express');
const path = require('path');
/*const bodyParser = require('body-parser')*/

const recordsRoute = require('./routes/records');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use('/records/', recordsRoute);

module.exports = app;
