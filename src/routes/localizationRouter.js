const express = require('express');
const path = require('path');
const router = express.Router();
const localizationController = require('../controllers/localizationController');

const tokenMiddleware = require(path.resolve(
  __dirname, '..', 'middlewares', 'tokenMiddleware')
);

TM = tokenMiddleware.isAuthenticated;

router.post('/',TM, localizationController.create);
router.delete('/:id',TM, localizationController.destroy);
router.put('/:id',TM, localizationController.edit);
router.get('/user/:id',TM, localizationController.readByUser);

module.exports = router;
