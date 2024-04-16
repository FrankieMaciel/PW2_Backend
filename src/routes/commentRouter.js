const express = require('express');
const path = require('path');
const router = express.Router();
const commentController = require('../controllers/commentController');

const tokenMiddleware = require(path.resolve(
  __dirname, '..', 'middlewares', 'tokenMiddleware')
);

TM = tokenMiddleware.isAuthenticated;

router.get('/', TM, commentController.readAll);
router.get('/user/:id', TM, commentController.readByUser);
router.get('/post/:id', TM, commentController.findPostsComment);
router.post('/', TM, commentController.create);
router.put('/:id', TM, commentController.editPost);
router.delete('/:id', TM, commentController.destroy);

module.exports = router;
