const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/topics', publicController.topicsIndex);
router.get('/topics/:slug', publicController.topicsShow);

module.exports = router;
