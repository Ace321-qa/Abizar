const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');

router.get('/', audioController.index);

module.exports = router;
