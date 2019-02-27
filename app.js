require('./config/config');
const express = require('express');
const indexRouter = require('./routes');

const app = express();

app.use(express.json());

app.use('/api/v1', indexRouter);

module.exports = app;
