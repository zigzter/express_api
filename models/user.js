const knex = require('../db/client');
const bcrypt = require('bcrypt');

module.exports = class User {
    static async create({ username, password }) {
        const passwordDigest = await bcrypt.hash(password, 10);
        return knex('users').insert({ username, passwordDigest }).returning('username');
    }
    static async find(username) {
        if (username) {
            return knex('users').where({ username }).first();
        }
        const users = await knex('users');
        return users;
    }
}
