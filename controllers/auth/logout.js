

module.exports = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged you out');
    res.redirect('/auth/login');
}