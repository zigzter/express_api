const Submission = require('../models/submission');
const Subreddit = require('../models/subreddit');

module.exports = {
    async create(req, res) {
        const author_id = res.userId;
        const { name } = req.params;
        const subreddit = await Subreddit.find(name);
        if (!subreddit) return res.status(404).send();
        const subreddit_id = subreddit.id;
        const { title, url, text, type } = req.body;
        const { submission, error } = await Submission.create({ subreddit_id, title, author_id, url, text, type });
        if (error) return res.status(400).json({ error });
        res.status(200).json({ submission });
    },
    async show(req, res) {
        const { short_id, name } = req.params;
        const { submission, error } = await Submission.find(short_id);
        if (error) return res.status(404).json({ error });
        res.status(200).json({ submission });
    },
    async edit(req, res) {
        const { short_id } = req.params;
        const { title, url, text } = req.body;
        const { submission, error } = await Submission.edit({ short_id, title, url, text });
        if (error) return res.status(400).json({ error });
        res.status(200).json({ submission });
    },
    // delete (moderator vs user?)
}
