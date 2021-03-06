const Subreddit = require('./../models/subreddit');

module.exports = {
    async index(req, res) {
        const subreddits = await Subreddit.find();
        res.status(200).json({ subreddits });
    },
    async create(req, res) {
        const { name, description, sidebar } = req.body;
        if (!name || !description) return res.status(400).send();
        const { subreddit, error } = await Subreddit.create(name, description, sidebar);
        if (error) return res.status(400).json({ error });
        res.status(200).json({ subreddit });
    },
    async show(req, res) {
        const { name } = req.params;
        const subreddit = await Subreddit.find(name);
        if (!subreddit) return res.status(404).send();
        res.status(200).json({ subreddit });
    },
}
