

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/auth/login');
    }
}