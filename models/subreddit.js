const knex = require('./../db/client');

module.exports = class Subreddit {
    static async find(name) {
        if (!name) return knex('subreddits');
        return knex('subreddits').where({ name }).first();
    }
    static async create(name, description, sidebar = null) {
        return knex('subreddits').insert({ name, description, sidebar }).returning(['name', 'description', 'sidebar']);
    }
}
