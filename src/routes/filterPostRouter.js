const express = require('express');
const path = require('path');
const router = express.Router();

const filterPostController = require(path.resolve(__dirname, '..', 'controllers', 'filterPostController'));

const tokenMiddleware = require(path.resolve(__dirname, '..', 'middlewares', 'tokenMiddleware'));
TM = tokenMiddleware.isAuthenticated;

router.get('/:text', TM, filterPostController.filterPosts);
router.get('/user/:user/:text', TM, filterPostController.readByUserAndText);
router.get('/user/:user', TM, filterPostController.readByUser);
router.get('/', TM, filterPostController.filterAllPosts);


module.exports = router;