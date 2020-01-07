const express = require('express');
const router = express.Router();

// CONTROLLERS
const getLogin = require('../controllers/auth/getLogin');
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');

// GET LOGIN ROUTE
router.get('/login', getLogin);

// POST LOGIN LOGIC
router.post('/login', login);

// GET LOGOUT ROUTE
router.get('/logout', logout);

module.exports = router;