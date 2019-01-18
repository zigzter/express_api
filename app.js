const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.status(200).send({ users });
});

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.status(200).json(user);
});

app.get('/users/:id', (req, res) => {
    // retrieve user
});

module.exports = app;
