const knex = require('./../db/client');

module.exports = class Subreddit {
    static async find(name) {
        if (!name) return knex('subreddits');
        return knex('subreddits').where({ name }).first();
    }
}
