const request = require('supertest');
const expect = require('expect');
const app = require('../app');
const knex = require('./../db/client');
const { seedUsers } = require('./seed/seed');
const User = require('./../models/user');

beforeEach(seedUsers);

afterAll(() => {
    knex.destroy();
});

describe('GET /users', () => {
    test('it should respond with a list of users', (done) => {
        request(app)
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).toBe(2);
            })
            .end(done)
    });
});

describe('POST /users', () => {
    test('it should save to db', (done) => {
        request(app)
            .post('/users')
            .send({ username: 'bob', password: 'woow' })
            .expect(200)
            .expect((res) => {
                expect(res.body[0]).toBe('bob');
            })
            .end((err, res) => {
                if (err) return done(err);
                User.find('bob').then((user) => {
                    expect(user.username).toBe('bob');
                    done();
                }).catch(e => done(e));
            });
    });
});
