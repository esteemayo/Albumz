const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const SendEmail = require('../utils/sendEmail');
const email = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename;

    const user = await User.create(req.body);

    const url = `${req.protocol}://${req.get('host')}/auth/login`;
    await new SendEmail(user, url).sendWelcome();

    next();
});

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/albums',
        failureRedirect: '/auth/login',
        successFlash: 'Welcome to Albumz',
        failureFlash: true
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged you out');
    res.redirect('/');
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ 'email': req.body.email });

    if (!user) {
        req.flash('error', 'There is no user with that email address');
        return res.redirect('/auth/forgot');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/auth/reset/${resetToken}`;

    const message = `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.
        \nPlease click on the following link, or paste this into your browser to complete the process:\n
        ${resetURL} If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    const html = `
        <h3>Hello, ${user.fullName}</h3>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p><a href="${resetURL}">Reset your password</a></p>
        <p>${resetURL}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
        await email({
            email: user.email,
            subject: 'Password reset token (valid for 10 minutes)',
            message,
            html
        });

        req.flash('success_msg', `An e-mail has been sent to ${user.email} with further instructions.`);
        res.redirect('/auth/forgot');
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        req.flash('error_msg', 'There was an error sending the email. Please try again!');
        res.redirect('/auth/forgot');
    }
});

exports.resetPasswordForm = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.redirect('/auth/forgot');
    }

    res.status(200).render('forgot/reset', {
        title: 'Reset your account password'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, set the new password
    if (!user) {
        req.flash('error_msg', 'Token is invalid or has expired');
        return res.redirect('/auth/forgot');
    }

    user.password = req.body.password;
    user.confirm = req.body.confirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success_msg', 'Success! Your password has been changed.');
    res.redirect('/auth/login');
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // Get user from colletion
    const user = await User.findById(req.user.id);

    // Check if posted current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        req.flash('error_msg', 'Oops! Your current password is wrong.');
        return res.redirect('back');
    }

    // Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Redirect the user
    req.flash('success_msg', '💃💃💃 Your password has been successfully updated! 💃💃💃');
    res.redirect('back');
});

exports.protect = (req, res, next) => {
    if (req.isAuthenticated()) return next();

    req.flash('error_msg', 'Oops you must be logged in to do that!');
    return res.redirect('/auth/login');
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
}

exports.getRegisterForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('users/register', {
        title: 'Sign up your account!'
    });
};

exports.getLoginForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('users/login', {
        title: 'Login into your account!'
    });
};

exports.forgotPasswordForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('forgot/forgot', {
        title: 'Forgot password!'
    });
};