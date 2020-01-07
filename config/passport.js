const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // MATCH USER
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Authentication Failed' });
                }

                // MATCH PASSWORD
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) throw err;

                    if (isValid) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Authentication Failed' });
                    }
                });
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}