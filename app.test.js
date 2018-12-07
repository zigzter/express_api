const request = require('supertest');
const app = require('./app');

describe('Test the root user path', () => {
    test('it should respond to GET', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
    });
});

describe('Test user creation', () => {
    beforeEach(() => {
        require('knex')({
            client: 'pg',
            connection: 'postgres://ziggy:yeezy@localhost:5432/express_api_test'
        });
    });
    test('it should save to db', async () => {
        const res = await request(app).post('/users')
            .send({ username: 'bob', password: 'bob' }).type('form');
        expect(res.statusCode).toBe(200);
    })
})