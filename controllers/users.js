const User = require('./../models/user');

module.exports = {
    async index(req, res) {
        const users = await User.find();
        res.status(200).send({ users });
    },
    async create(req, res) {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send()
        const user = await User.create({ username, password });
        res.status(200).json(user);
    },
    async show(req, res) {
        const user = await User.find(req.params.id);
        if (!user) return res.status(404).send();
        res.status(200).send({ user });
    },
}
