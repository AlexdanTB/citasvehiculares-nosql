const express = require('express');
const router = express.Router();
const { dashboard, health } = require('../controllers/dashboardController');

router.get('/', dashboard);
router.get('/health', health);

module.exports = router;