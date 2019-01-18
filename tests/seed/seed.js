const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('./../../db/client');

const users = [
    {
        username: 'yeezus',
        passwordDigest: bcrypt.hashSync('wow', 10),
        // tokens: [{
        //     access: 'auth',
        //     token: jwt.sign({ id: 1, access: 'auth' }, 'secretkey!').toString(),
        // }],
    },
    {
        username: 'dumile',
        passwordDigest: bcrypt.hashSync('nice', 10),
    },
];

const seedUsers = async () => {
    await knex('users').del();
    return Promise.all(users.map(user => knex('users').insert(user)));
}

module.exports = {
    users,
    seedUsers,
};
