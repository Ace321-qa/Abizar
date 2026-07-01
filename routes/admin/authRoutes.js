const express = require('express');
const router = express.Router();
const adminAuthController = require('../../controllers/adminAuthController');

router.get('/login', adminAuthController.loginForm);
router.post('/login', adminAuthController.login);
router.get('/logout', adminAuthController.logout);

module.exports = router;
