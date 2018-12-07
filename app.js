const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();

app.get('/users', (req, res) => {
    res.status(200).send();
});

app.post('/users', (req, res) => {
    const { username, password } = req.body;
    const user = User.create({ username, password });
    res.status(200).json(user);
});

app.get('/users/:id', (req, res) => {
    // retrieve user
});

module.exports = app;
