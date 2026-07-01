const express = require('express');
const router = express.Router();
const requireAdmin = require('../../middleware/requireAdmin');
const adminDashboardController = require('../../controllers/adminDashboardController');

router.get('/dashboard', requireAdmin, adminDashboardController.dashboard);

module.exports = router;
