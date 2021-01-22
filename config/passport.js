const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Match user
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Incorrect email or password!' });
            }

            // Match password
            const isValid = await user.correctPassword(password, user.password);
            if (isValid) {
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect email or password!' });
                
        } catch (err) {
            if (err) throw err;
        }
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