const path = require('path');
const express = require('express');
const router = express.Router();

const userController = require(path.resolve(
  __dirname, '..', 'controllers', 'userController')
);

const tokenMiddleware = require(path.resolve(
  __dirname, '..', 'middlewares', 'tokenMiddleware')
);

const multer = require(path.resolve(__dirname, '..', 'lib', 'multer'));

TM = tokenMiddleware.isAuthenticated;

router.post('/', userController.create);
router.get('/',TM, userController.readAll);
router.post('/login', userController.login);
router.get('/:id',TM, userController.readById);
router.put('/:id',TM, userController.update);
router.delete('/:id',TM, userController.destroy);
router.get('/profilePicture/:id',TM, userController.SendProfile);
router.post('/profilePicture/:id',TM, multer.parser.single('pf-picture'), userController.ChangeProfile);

module.exports = router;