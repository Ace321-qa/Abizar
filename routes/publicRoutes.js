const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.home);
router.get('/about', publicController.about);
router.get('/lang/:code', publicController.setLang);
router.post('/lang/:code', publicController.setLang);

module.exports = router;
