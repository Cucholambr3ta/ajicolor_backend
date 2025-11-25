const express = require('express');
const router = express.Router();
const { checkSystemHealth } = require('../controllers/healthController');

// Health check endpoint (no authentication required for monitoring)
// @desc    Check system health and database connectivity
// @route   GET /api/health/status
// @access  Public (for monitoring tools)
router.get('/status', checkSystemHealth);

module.exports = router;
