const knex = require('../db/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = class User {
    static async create({ username, password }) {
        const passwordDigest = await bcrypt.hash(password, 10);
        const [user] = await knex('users').insert({ username, passwordDigest }).returning(['username', 'id']);
        const payload = {
            id: user.id,
            access: 'auth',
        }
        user.token = jwt.sign(payload, 'replacethis').toString();
        return user;
    }
    static async find(username) {
        if (!username) return knex('users');
        return knex('users').where({ username }).first().select('id', 'username');
    }
}
