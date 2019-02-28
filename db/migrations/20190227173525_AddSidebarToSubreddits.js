
exports.up = function (knex, Promise) {
    return knex.schema.table('subreddits', (t) => {
        t.text('sidebar');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.table('subreddits', (t) => {
        t.dropColumn('sidebar');
    })
};
