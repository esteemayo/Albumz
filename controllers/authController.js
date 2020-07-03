const _ = require('lodash');
const passport = require('passport');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');
// const email = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
    const userObj = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'confirm', 'location', 'favGenres', 'favArtists']);

    const user = await User.create(userObj);

    user.password = undefined;

    const url = `${req.protocol}://${req.get('host')}/auth/login`;
    await new sendEmail(user, url).sendWelcome();

    req.flash('success', `You're now registered and can login in`);
    res.status(201).redirect('/auth/login');
});

exports.login = catchAsync(async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/albums',
        failureRedirect: '/auth/login',
        successFlash: 'Welcome to Albumz',
        failureFlash: true
    })(req, res, next);
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged you out');
    res.redirect('/auth/login');
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('There is no user with that email');
        return res.status(404).redirect('/auth/forgot');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });


    /*
    const message = `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.
    \nPlease click on the following link, or paste this into your browser to complete the process:\n
    ${resetURL} If you did not request this, please ignore this email and your password will remain unchanged.
    `;
    await email({
        email: user.email,
        subject: 'Your password reset token (valid for 10 mins)',
        message
    });
    */

    try {
        const resetURL = `${req.protocol}://${req.get('host')}/auth/reset/${resetToken}`;

        await new sendEmail(user, resetURL).sendPasswordReset();

        req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
        res.status(200).redirect('/auth/forgot');
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        req.flash('error', 'There was an error sending the email. Please try again!')
        res.status(500).redirect('/auth/forgot');
    }
});

exports.resetPasswordForm = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.status(401).redirect('/auth/forgot');
    }

    res.status(200).render('forgot/reset', {
        title: 'Reset your account password',
        token: req.params.token
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, set the new passwo
    if (!user) {
        req.flash('error', 'Token is invalid or has expired');
        return res.status(400).redirect('/auth/forgot');
    }

    user.password = req.body.password;
    user.confirm = req.body.confirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    req.flash('success', 'Success! Your password has been changed.');
    res.status(200).redirect('/auth/login');
});

exports.protect = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/auth/login');
};

exports.getRegisterForm = (req, res) => {
    if (req.isAuthenticated()) return res.status(200).redirect('/');
    res.status(200).render('users/register');
};

exports.getLoginForm = (req, res) => {
    if (req.isAuthenticated()) return res.status(200).redirect('/');
    res.status(200).render('users/login');
};

exports.forgotPasswordForm = (req, res) => {
    if (req.isAuthenticated()) return res.status(200).redirect('/');
    res.status(200).status(200).render('forgot/forgot');
};

exports.apiLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password'));
    }

    user.password = undefined;

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});