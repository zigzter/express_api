const bcrypt = require('bcrypt');
const User = require('./../models/user');

module.exports = {
    async create(req, res) {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send();
        const user = await User.find(username);
        if (!user) return res.status(400).send();
        if (await User.authenticate(user.username, password)) {
            return res.status(200).send();
        }
        res.status(400).send();
    }
}
