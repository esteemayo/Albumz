const express = require('express');
const User = require('../models/User');
const sendEmail = require('../utils/email');
// const async = require('async');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const router = express();

// GET FORGOT ROUTE
router.get('/', (req, res) => {
    res.status(200).render('forgot/forgot');
});

router.post('/', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('There is no user with that email');
        return res.redirect('/auth/forgot');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/auth/reset/${resetToken}`;

    const message = `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.\nPlease click on the following link, or paste this into your browser to complete the process:\n
    ${resetURL} If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 mins)',
            message
        });

        req.flash('success', 'Token sent to email');
        res.status(200).redirect('/auth/forgot');
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        req.flash('error', 'There was an error sending the email. Please try again!')
        res.status(500).redirect('/auth/forgot');
    }
});

/*
router.post('/', (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, (err, buffer) => {
                let token = buffer.toString('hex');
                done(err, token);
            });
        },

        function (token, done) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/auth/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000 // 1hr

                user.save(err => {
                    done(err, token, user);
                });
            });
        },

        function (token, user, done) {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                to: user.email,
                from: process.env.CLIENT_MAIL,
                subject: 'Albumz Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\nPlease click on the following link, or paste this into your browser to complete the process:\n
                ${req.protocol}://${req.get('host')}/auth/reset/${token} \n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            transporter.sendMail(mailOptions, err => {
                req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
                done(err, 'done');
            });
        }
    ], err => {
        if (err) return next(err);
        res.redirect('/auth/forgot');
    });
});
*/

module.exports = router;