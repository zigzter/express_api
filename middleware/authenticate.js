const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

module.exports = (req, res, next) => {
    const token = req.get('x-auth');
    if (!token) return res.status(401).send();
    const decoded = jwt.verify(token, JWT_KEY);
    if (decoded.access !== 'auth') return res.status(401).send();
    next();
};
