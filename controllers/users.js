const User = require('./../models/user');

module.exports = {
    async index(req, res) {
        const users = await User.find();
        res.status(200).json({ users });
    },
    async create(req, res) {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send();
        const { user, error } = await User.create({ username, password });
        if (error) return res.status(400).json({ error });
        res.status(200).header('Authorization', `Bearer ${ user.token }`).json({ user });
    },
    async show(req, res) {
        const user = await User.find(req.params.id);
        if (!user) return res.status(404).send();
        res.status(200).json({ user });
    },
}
