const request = require('supertest');
const expect = require('expect');
const app = require('../app');
const knex = require('./../db/client');
const { seedUsers, seedSubs } = require('./seed/seed');
const User = require('./../models/user');
const Subreddit = require('./../models/subreddit');

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
                expect(res.body.username).toBe('bob');
            })
            .end((err, res) => {
                if (err) return done(err);
                User.find('bob').then((user) => {
                    expect(user.username).toBe('bob');
                    done();
                }).catch(e => done(e));
            });
    });
    test('it should send the jwt token', (done) => {
        request(app)
            .post('/api/users')
            .send({ username: 'steve', password: 'woow' })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end(done);
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

describe('POST /r', () => {
    test('it creates a new subreddit', (done) => {
        request(app)
            .post('/api/r')
            .send({ name: 'gzcl', description: 'eat burritos' })
            .expect(200)
            .expect((res) => {
                expect(res.body.subreddit.name).toBe('gzcl');
            })
            .end((err, res) => {
                if (err) return done(err);
                Subreddit.find().then((subs) => {
                    expect(subs.length).toBe(3);
                    done();
                }).catch(e => done(e));
            });
    });
    test('it does not create a new subreddit with invalid data', (done) => {
        request(app)
            .post('/api/r')
            .send({ description: 'aw heck no name provided' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                Subreddit.find().then((subs) => {
                    expect(subs.length).toBe(3);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /r/:id', () => {
    test('it returns subreddit info', (done) => {
        request(app)
            .get('/api/r/hiphopheads')
            .expect(200)
            .expect((res) => {
                expect(res.body.subreddit.name).toBe('hiphopheads');
            })
            .end(done);
    });
    test('it returns 404 if not found', (done) => {
        request(app)
            .get('/api/r/nope')
            .expect(404)
            .end(done);
    });
});
