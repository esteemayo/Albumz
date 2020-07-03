const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

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

router.post('/api/v1/users/login', authController.apiLogin);

router
    .route('/api/v1/users')
    .get(userController.getAllUser)
    .post(userController.createUser);

router
    .route('/api/v1/users/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;