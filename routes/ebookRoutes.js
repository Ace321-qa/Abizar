const express = require('express');
const router = express.Router();
const ebookController = require('../controllers/ebookController');

router.get('/', ebookController.index);
router.get('/:slug', ebookController.show);

module.exports = router;
