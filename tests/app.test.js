const request = require('supertest');
const jwt = require('jsonwebtoken');
const expect = require('expect');

const { seedUsers, seedSubs, seedSubmissions } = require('./seed/seed');
const Subreddit = require('./../models/subreddit');
const Submission = require('./../models/submission');
const User = require('./../models/user');
const knex = require('./../db/client');
const app = require('../app');

const { JWT_KEY } = process.env;

const API_PREFIX = '/api/v1';

let user1token;

beforeAll(seedUsers);
beforeAll(seedSubs);
beforeAll(seedSubmissions);
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
            .get(API_PREFIX + '/users')
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
            .post(API_PREFIX + '/users')
            .send({ username: 'bob', password: 'woow' })
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).toBe('bob');
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
            .post(API_PREFIX + '/users')
            .send({ username: 'steve', password: 'woow' })
            .expect(200)
            .expect((res) => {
                expect(res.header['authorization']).toBeTruthy();
            })
            .end(done);
    });
    test('it should not save to db with invalid data', (done) => {
        request(app)
            .post(API_PREFIX + '/users')
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
            .get(API_PREFIX + '/users/bob')
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).toBe('bob')
            })
            .end(done);
    });
    test('it returns 404 if user not found', (done) => {
        request(app)
            .get(API_PREFIX + '/users/nousernamedthis')
            .expect(404)
            .end(done);
    });
});

describe('GET /r', () => {
    test('it returns an index of subreddits', (done) => {
        request(app)
            .get(API_PREFIX + '/r')
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
            .post(API_PREFIX + '/r')
            .set('Authorization', `Bearer ${ user1token }`)
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
            .post(API_PREFIX + '/r')
            .set('Authorization', `Bearer ${ user1token }`)
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
            .get(API_PREFIX + '/r/hiphopheads')
            .expect(200)
            .expect((res) => {
                expect(res.body.subreddit.name).toBe('hiphopheads');
            })
            .end(done);
    });
    test('it returns 404 if not found', (done) => {
        request(app)
            .get(API_PREFIX + '/r/nope')
            .expect(404)
            .end(done);
    });
});

describe('POST /session', () => {
    test('it returns 400 if username or password is blank', (done) => {
        request(app)
            .post(API_PREFIX + '/session')
            .send({ username: 'bob' })
            .expect(400)
            .end(done);
    });
    test('it returns 400 if password is incorrect', (done) => {
        request(app)
            .post(API_PREFIX + '/session')
            .send({ username: 'bob', password: 'wrong' })
            .expect(400)
            .end(done);
    });
    test('it sets an Authorization header with a JWT token', (done) => {
        request(app)
            .post(API_PREFIX + '/session')
            .send({ username: 'bob', password: 'woow' })
            .expect(200)
            .expect((res) => {
                expect(res.header['authorization'].length).toBeGreaterThan(20);
            })
            .end(done);
    });
});

describe('POST /:name', () => {
    test('creates a submission with valid data', (done) => {
        request(app)
            .post(API_PREFIX + '/r/hiphopheads')
            .set('Authorization', `Bearer ${ user1token }`)
            .send({ type: 'text', title: 'Title of post', text: 'Some text here about the post' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                Submission.find(res.body.submission.short_id).then(({ submission }) => {
                    expect(submission).toBeTruthy();
                    done();
                });
            });
    });
});
