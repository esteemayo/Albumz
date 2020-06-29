const mongoose = require('mongoose');
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
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    confirm: {
        type: String,
        minlength: 6,
        maxlength: 1024
    },
    location: {
        type: String
    },
    favGenres: {
        type: String
    },
    favArtists: {
        type: String
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    /*
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    */

    // console.log({ resetToken }, this.passwordResetToken);
    console.log(resetToken);

    this.passwordResetExpires = Date.now + 10 * 60 * 1000; // 1o mins

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);