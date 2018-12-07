// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'express_api',
      username: 'ziggy',
      password: 'yeezy'
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'express_api_test',
      username: 'ziggy',
      password: 'yeezy'
    }
  }


};
