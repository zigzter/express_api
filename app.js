const express = require('express');
const jwt = require('jsonwebtoken');
const indexRouter = require('./routes');

const app = express();

app.use(express.json());

app.use('/api', indexRouter);

module.exports = app;
