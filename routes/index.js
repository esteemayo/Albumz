const express = require('express');
const router = express.Router();

// CONTROLLER
const index = require('../controllers/index');

// GET INDEX ROUTE
router.get('/', index);

module.exports = router;