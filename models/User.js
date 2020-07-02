const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your firstName!']
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your lastName!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 6,
        maxlength: 1024
    },
    confirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 6,
        maxlength: 1024,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    location: {
        type: String,
        required: [true, 'Please tell us where you are located']
    },
    favGenres: {
        type: String,
        required: [true, 'Please tell us your favorite genre']
    },
    favArtists: {
        type: String,
        required: [true, 'Please tell us your favorite artist']
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.confirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = resetToken;
    /*
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    */

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now + 10 * 60 * 1000; // 10 mins

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;