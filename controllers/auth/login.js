const passport = require('passport');

module.exports = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/albums',
        failureRedirect: '/auth/login',
        successFlash: 'Welcome to Albumz',
        failureFlash: true
    })(req, res, next);
}