const Submission = require('../models/submission');
const Subreddit = require('../models/subreddit');

module.exports = {
    // index
    async create(req, res) {
        const { name } = req.params;
        const subreddit = await Subreddit.find(name);
        if (!subreddit) return res.status(404).send();
        const subreddit_id = subreddit.id;
        const { title, author_id, url, text, type } = req.body;
        const { submission, error } = await Submission.create({ subreddit_id, title, author_id, url, text, type });
        if (error) return res.status(400).json({ error });
        res.status(200).json({ submission });
    }
    // show
    // edit
    // delete (moderator vs user?)
}
