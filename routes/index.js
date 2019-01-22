const express = require('express');
const userController = require('./../controllers/users');
const subredditController = require('./../controllers/subreddits');
const authenticate = require('./../middleware/authenticate');

const router = express.Router();

router.get('/users', userController.index);
router.post('/users', userController.create);
router.get('/users/:id', userController.show);

router.get('/r', subredditController.index);
router.post('/r', authenticate, subredditController.create);
router.get('/r/:name', subredditController.show);

module.exports = router;
