const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const md5 = require('md5');

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
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please tell us your username'],
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8,
        maxlength: 1024
    },
    confirm: {
        type: String,
        // required: [true, 'Please confirm your password'],
        minlength: 8,
        maxlength: 1024,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role is either: user or admin'
        },
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
    },
    favGenres: {
        type: String
    },
    favArtists: {
        type: String
    },
    photo: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=150`;
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

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.resetPasswordToken);

    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;    // 10 mins

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;