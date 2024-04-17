const express = require('express');
const path = require('path');
const router = express.Router();
const commentController = require('../controllers/commentController');

const tokenMiddleware = require(path.resolve(
  __dirname, '..', 'middlewares', 'tokenMiddleware')
);

TM = tokenMiddleware.isAuthenticated;

router.get('/', commentController.readAll);
router.get('/user/:username', commentController.readByUser);
router.get('/post/:postId', commentController.findPostsComment);
router.post('/', TM, commentController.create);
router.put('/:id', TM, commentController.update);
router.delete('/:id', TM, commentController.delete);

module.exports = router;
