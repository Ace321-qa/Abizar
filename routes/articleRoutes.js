const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/', articleController.index);
router.get('/:slug', articleController.show);

module.exports = router;
