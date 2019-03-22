
exports.up = function (knex, Promise) {
    return knex.schema.createTable('submissions', (t) => {
        t.increments('id');
        t.integer('subreddit_id').unsigned().references('subreddits.id');
        t.integer('author_id').unsigned().references('users.id');
        t.string('sub_id');
        t.string('title');
        t.string('url');
        t.string('type');
        t.text('text');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('submissions');
};
