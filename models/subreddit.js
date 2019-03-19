const knex = require('./../db/client');

module.exports = class Subreddit {
    static async find(name) {
        if (!name) return knex('subreddits');
        return knex('subreddits').where({ name }).first();
    }
    static async create(name, description, sidebar) {
        if (name.length < 3) return { error: 'Name must be at least 3 characters' }
        const [subreddit] = await knex('subreddits').insert({ name, description, sidebar }).returning(['name', 'description', 'sidebar']);
        return { subreddit };
    }
}
