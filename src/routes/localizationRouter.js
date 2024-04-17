const express = require('express');
const path = require('path');
const router = express.Router();
const localizationController = require('../controllers/localizationController');

const tokenMiddleware = require(path.resolve(__dirname, '..', 'middlewares', 'tokenMiddleware'));
TM = tokenMiddleware.isAuthenticated;

router.get('/user/:id', TM, localizationController.readByUser);
router.post('/', TM, localizationController.create);
router.put('/:id', TM, localizationController.update);
router.delete('/:id', TM, localizationController.delete);

module.exports = router;
