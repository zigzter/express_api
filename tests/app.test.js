const request = require('supertest');
const jwt = require('jsonwebtoken');
const expect = require('expect');

const { seedUsers, seedSubs } = require('./seed/seed');
const Subreddit = require('./../models/subreddit');
const User = require('./../models/user');
const knex = require('./../db/client');
const app = require('../app');

const { JWT_KEY } = process.env;

let user1token;

beforeAll(seedUsers);
beforeAll(seedSubs);
beforeAll(async () => {
    await User.find('yeezus').then((user) => {
        user1token = jwt.sign({ id: user.id, access: 'auth' }, JWT_KEY).toString();
    });
})

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
            .set('x-auth', user1token)
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
            .set('x-auth', user1token)
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

describe('POST /session', () => {
    test('it returns 400 if username or password is blank', (done) => {
        request(app)
            .post('/api/session')
            .send({ username: 'bob' })
            .expect(400)
            .end(done);
    });
    test('it returns 400 if password is incorrect', (done) => {
        request(app)
            .post('/api/session')
            .send({ username: 'bob', password: 'wrong' })
            .expect(400)
            .end(done);
    });
    test('it sets an x-auth header with a JWT token', (done) => {
        request(app)
            .post('/api/session')
            .send({ username: 'bob', password: 'woow' })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth'].length).toBeGreaterThan(20);
            })
            .end(done)
    });
});
