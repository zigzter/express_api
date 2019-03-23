const express = require('express');
const userController = require('../controllers/users');
const subredditController = require('../controllers/subreddits');
const sessionController = require('../controllers/sessions');
const submissionController = require('../controllers/submissions');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/users', userController.index);
router.post('/users', userController.create);
router.get('/users/:id', userController.show);

router.get('/r', subredditController.index);
router.post('/r', authenticate, subredditController.create);
router.get('/r/:name', subredditController.show);

router.post('/r/:name', submissionController.create);

router.post('/session', sessionController.create);

module.exports = router;
