const Subreddit = require('./../models/subreddit');

module.exports = {
    async index(req, res) {
        const subreddits = await Subreddit.find();
        res.status(200).send({ subreddits });
    },
}
