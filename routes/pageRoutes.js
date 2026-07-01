const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/:slug', pageController.show);

module.exports = router;
