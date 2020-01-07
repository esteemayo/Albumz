const express = require('express');
const router = express.Router();

// CONTROLLERS
const register = require('../controllers/users/register');
const registerLogic = require('../controllers/users/registerLogic');

// GET REGISTER ROUTE
router.get('/', register);

// POST REGISTER LOGIC
router.post('/', registerLogic);

module.exports = router;