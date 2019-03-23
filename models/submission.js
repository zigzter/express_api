const crypto = require('crypto');

const knex = require('../db/client');

module.exports = class Submission {
    static async create({ subreddit_id, author_id, title, url, type, text }) {
        if (type !== 'link' && type !== 'text') return { error: 'Please specify a valid type of submission' };
        if (!title) return { error: 'Please add a title' };
        if ((type === 'link' && !url) || (type === 'text' && !text)) return { error: 'Please add a URL or text' };
        const short_id = crypto.randomBytes(4).toString('hex');
        const submission = await knex('submissions')
            .insert({ subreddit_id, author_id, short_id, title, url, type, text })
            .returning(['short_id', 'author_id', 'title', (type === 'link') ? 'url' : 'text']);
        return { submission };
    }
    // find
    // edit
    // delete
}