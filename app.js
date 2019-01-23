require('./config/config');
const express = require('express');
const indexRouter = require('./routes');

const app = express();

app.use(express.json());

app.use('/api', indexRouter);

module.exports = app;
