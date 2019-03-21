const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

module.exports = (req, res, next) => {
    const tokenString = req.get('Authorization');
    if (!tokenString) return res.status(401).send();
    const token = tokenString.split(' ')[1];
    const decoded = jwt.verify(token, JWT_KEY);
    if (decoded.access !== 'auth') return res.status(401).send();
    next();
};
