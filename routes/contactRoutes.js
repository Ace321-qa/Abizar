const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/contact', publicController.contact);

module.exports = router;
