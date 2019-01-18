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
    if (!username || !password) return res.status(400).send()
    const user = await User.create({ username, password });
    res.status(200).json(user);
});

app.get('/users/:id', async (req, res) => {
    const user = await User.find(req.params.id);
    if (!user) return res.status(404).send();
    res.status(200).send({ user });
});

module.exports = app;
