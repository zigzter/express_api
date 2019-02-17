const jwt = require('jsonwebtoken');
const User = require('./../models/user');

const { JWT_KEY } = process.env;

module.exports = {
    async create(req, res) {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send();
        const user = await User.find(username);
        if (!user) return res.status(400).send();
        if (await User.authenticate(user.username, password)) {
            const token = jwt.sign({ id: user.id, access: 'auth' }, JWT_KEY).toString();
            return res.status(200).set('x-auth', token).send();
        }
        res.status(400).send();
    },
    destroy(req, res) {
        res.status(200).set('x-auth', undefined).send();
    },
}
