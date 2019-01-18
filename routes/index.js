const express = require('express');
const userController = require('./../controllers/users');

const router = express.Router();

router.get('/users', userController.index);
router.post('/users', userController.create);
router.get('/users/:id', userController.show);

module.exports = router;
