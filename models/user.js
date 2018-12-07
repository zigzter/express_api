const knex = require('../db/client');
const bcrypt = require('bcrypt');

module.exports = class User {
    static async create({ username, password }) {
        const passwordDigest = await bcrypt.hash(password, 10);
        return knex('users').insert({ username, passwordDigest });
    }
}