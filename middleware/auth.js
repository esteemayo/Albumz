

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();

    req.flash('error_msg', 'Oops you must be logged in to do that!');
    res.redirect('/auth/login');
}