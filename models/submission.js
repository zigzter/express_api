const crypto = require('crypto');

const knex = require('../db/client');

module.exports = class Submission {
    static async create({ subreddit_id, author_id, title, url, type, text }) {
        if (type !== 'link' && type !== 'text') return { error: 'Please specify a valid type of submission' };
        if (!title) return { error: 'Please add a title' };
        if ((type === 'link' && !url) || (type === 'text' && !text)) return { error: 'Please add a URL or text' };
        const short_id = crypto.randomBytes(4).toString('hex');
        const [submission] = await knex('submissions')
            .insert({ subreddit_id, author_id, short_id, title, url, type, text })
            .returning(['short_id', 'author_id', 'title', (type === 'link') ? 'url' : 'text']);
        return { submission };
    }
    static async find(short_id) {
        if (short_id.length !== 8) return { error: 'Please enter valid id' };
        const submission = await knex('submissions').where({ short_id }).first();
        return (submission) ? { submission } : { error: 'Submission not found' }
    }
    // edit
    // delete
}
