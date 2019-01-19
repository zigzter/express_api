const request = require('supertest');
const expect = require('expect');
const app = require('../app');
const knex = require('./../db/client');
const { seedUsers, seedSubs } = require('./seed/seed');
const User = require('./../models/user');

beforeAll(seedUsers);
beforeAll(seedSubs);

afterAll(() => {
    knex.destroy();
});

describe('GET /users', () => {
    test('it should respond with a list of users', (done) => {
        request(app)
            .get('/api/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).toBe(2);
            })
            .end(done)
    });
});

describe('POST /users', () => {
    test('it should save to db with valid data', (done) => {
        request(app)
            .post('/api/users')
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
    test('it should not save to db with invalid data', (done) => {
        request(app)
            .post('/api/users')
            .send({ username: 'pete' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                User.find('pete').then((user) => {
                    expect(user).toBeUndefined();
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /users/:id', () => {
    test('it returns a user if found', (done) => {
        request(app)
            .get('/api/users/bob')
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).toBe('bob')
            })
            .end(done);
    });
    test('it returns 404 if user not found', (done) => {
        request(app)
            .get('/api/users/nousernamedthis')
            .expect(404)
            .end(done);
    });
});

describe('GET /r', () => {
    test('it returns an index of subreddits', (done) => {
        request(app)
            .get('/api/r')
            .expect(200)
            .expect((res) => {
                expect(res.body.subreddits.length).toBe(2);
            })
            .end(done);
    });
});
