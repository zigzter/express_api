
exports.up = function (knex, Promise) {
    return knex.schema.createTable('subreddits', t => {
        t.increments('id');
        t.string('name');
        t.text('description');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('subreddits')
};
