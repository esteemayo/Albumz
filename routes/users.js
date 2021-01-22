const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const imageController = require('../controllers/imageController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router
    .route('/users/register')
    .get(authController.getRegisterForm)
    .post(
        imageController.upload,
        imageController.resize,
        authController.signup,
        authController.login
    );

router
    .route('/auth/login')
    .get(authController.getLoginForm)
    .post( authController.login);

router.get('/auth/logout', authController.logout);

router
    .route('/auth/forgot')
    .get(authController.forgotPasswordForm)
    .post(authController.forgotPassword);

router
    .route('/auth/reset/:token')
    .get(authController.resetPasswordForm)
    .post(authController.resetPassword);

router.get('/account',
    authController.protect,
    userController.account
);

router.post('/submit-user-data',
    authController.protect,
    imageController.upload,
    imageController.resize,
    userController.updateUserData
);

router.post('/updateMyPassword',
    authController.protect,
    authController.updateMyPassword
);

router.get('/users/profile/:username',
    authController.protect,
    userController.profile
);

router.delete('/users/account/delete-me',
    authController.protect,
    userController.deleteMe
);

// API
router
    .route('/api/v1/users')
    .get(userController.getAllUser)
    .post(
        imageController.upload,
        imageController.resize,
        userController.createUser
    );

router
    .route('/api/v1/users/:id')
    .get(
        validateObjectId,
        userController.getUser
    )
    .patch(
        imageController.upload,
        imageController.resize,
        userController.updateUser
    )
    .delete(
        validateObjectId,
        userController.deleteUser
    );

module.exports = router;