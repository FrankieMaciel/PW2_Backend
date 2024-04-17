const path = require('path');
const express = require('express');
const router = express.Router();

const postController = require(path.resolve(
  __dirname, '..', 'controllers', 'postController')
);

const tokenMiddleware = require(path.resolve(
  __dirname, '..', 'middlewares', 'tokenMiddleware')
);

TM = tokenMiddleware.isAuthenticated;

router.get('/', postController.readAll);
router.get('/user/:username', postController.readByUser);
router.post('/', TM, postController.create);
router.put('/:id', TM, postController.update);
router.delete('/:id', TM, postController.delete);

module.exports = router;