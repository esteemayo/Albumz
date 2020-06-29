const express = require('express');
const User = require('../models/User');
// const async = require('async');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

const router = express();

router.get('/', async (req, res) => {
    const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/auth/forgot');
    }

    res.status(200).render('forgot/reset', {
        token: req.params.token
    });
});

router.post('/', async (req, res) => {
    // const hashedToken = crypto
    //     .createHash('sha256')
    //     .update(req.params.token)
    //     .digest('hex');

    const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        req.flash('error', 'Token is invalid or has expired');
        return res.status(400).redirect('/auth/forgot');
    }

    try {
        user.password = req.body.password;
        user.confirm = req.body.confirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        req.flash('success', 'Success! Your password has been changed.');
        res.status(200).redirect('/auth/login');

        // res.status(200).json({
        //     status: 'sucsess',
        //     user
        // });

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'Token is invalid or has expired'
        });
    }
});

/*
router.get('/', (req, res) => {
    User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot');
        }
        res.status(200).render('forgot/reset', {
            token: req.params.token
        });
    });
});

router.get('/', async (req, res) => {
    try {
        const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot');
        }

        res.status(200).render('forgot/reset', {
            token: req.params.token
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});

router.post('/', (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    return user.setPassword(req.body.password, err => {
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;

                        user.save(err => {
                            req.logIn(user => {
                                done(err, user);
                            });
                        });
                    });
                }
                req.flash('error', 'Passwords do not match!');
                res.redirect('back');
            });
        },

        function (user, done) {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            let mailOptions = {
                to: user.email,
                from: process.env.CLIENT_MAIL,
                subject: 'Your password has been changed',
                text: `Hello,\n\n 
                This is a confirmation that the password for your account ${user.email} has just been changed.`
            };

            transporter.sendMail(mailOptions, err => {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], err => {
        res.redirect('/');
    });
});
*/

module.exports = router;