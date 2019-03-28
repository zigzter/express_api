const bcrypt = require('bcrypt');
const knex = require('./../../db/client');

const users = [
    {
        username: 'yeezus',
        passwordDigest: bcrypt.hashSync('wow', 10),
    },
    {
        username: 'dumile',
        passwordDigest: bcrypt.hashSync('nice', 10),
    },
];

const subreddits = [
    {
        name: 'vancouver',
        description: 'Why is everyone here so salty'
    },
    {
        name: 'hiphopheads',
        description: 'Money trees is the perfect place for shade'
    }
];

const submissions = [
    {
        type: 'text',
        title: 'I love sunny days',
        text: 'Unless it is super hot out then nevermind',
    }
];

const seedSubmissions = async () => {
    return Promise.all(submissions.map(sub => knex('submissions').insert(sub)));
}

const seedSubs = async () => {
    await knex('subreddits').del();
    return Promise.all(subreddits.map(r => knex('subreddits').insert(r)));
}

const seedUsers = async () => {
    await knex('submissions').del();
    await knex('users').del();
    return Promise.all(users.map(user => knex('users').insert(user)));
}

module.exports = {
    users,
    seedUsers,
    seedSubs,
    seedSubmissions,
};
