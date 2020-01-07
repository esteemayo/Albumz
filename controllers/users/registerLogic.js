const bcrypt = require('bcryptjs');
const User = require('../../models/User');

module.exports = (req, res) => {
    let errors = [];
    const { firstName, lastName, email, password, confirm, location, favGenres, favArtists } = req.body;

    if (!firstName) {
        errors.push({ msg: 'First name is required' });
    }

    if (!email) {
        errors.push({ msg: 'Email is required' });
    }

    if (!password) {
        errors.push({ msg: 'Password is required' });
    }

    if (password.length < 4) {
        errors.push({ msg: 'Password should be at least 4 characters long' });
    }

    if (password != confirm) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            firstName,
            lastName,
            email,
            password,
            confirm,
            location,
            favGenres,
            favArtists
        });
    } else {
        User.findOne({ email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered, choose another one.');
                    res.redirect('/users/register');
                } else {
                    const user = new User({
                        firstName,
                        lastName,
                        email,
                        password,
                        location,
                        favGenres,
                        favArtists
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if (err) throw err;

                            user.password = hash;
                            user.save()
                                .then(user => {
                                    req.flash('success', 'You\'re now registered and can login in');
                                    res.redirect('/auth/login');
                                });
                        });
                    });
                }
            });
    }
}