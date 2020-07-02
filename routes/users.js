const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/users/register', authController.getRegisterForm);

router.post('/users/register', authController.signup);

router.get('/auth/login', authController.getLoginForm);

router.post('/auth/login', authController.login);

router.get('/auth/logout', authController.logout);

router.get('/auth/forgot', authController.forgotPasswordForm);

router.post('/auth/forgot', authController.forgotPassword);

router.get('/auth/reset/:token', authController.resetPasswordForm);

router.post('/auth/reset/:token', authController.resetPassword);

module.exports = router;