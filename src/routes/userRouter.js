const path = require('path');
const express = require('express');
const router = express.Router();

const userController = require(path.resolve(__dirname, '..', 'controllers', 'userController'));

const tokenMiddleware = require(path.resolve(__dirname, '..', 'middlewares', 'tokenMiddleware'));
TM = tokenMiddleware.isAuthenticated;

const multer = require(path.resolve(__dirname, '..', 'lib', 'multer'));

router.get('/', userController.readAll);
router.get('/:id', userController.readById);
router.post('/', userController.create);
router.post('/login', userController.login);
router.put('/:id', TM, userController.update);
router.delete('/:id', TM, userController.delete);

router.get('/profilePicture/:id', TM, userController.sendProfile);
router.post('/profilePicture/:id', TM, multer.parser.single('pf-picture'), userController.changeProfile);

module.exports = router;