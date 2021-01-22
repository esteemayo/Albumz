const mongoose = require('mongoose');
const slugify = require('slugify');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A genre must have a name'],
        unique: true
    },
    slug: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'There must be a logged in user']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

genreSchema.pre('save', function(next) {
    if (!this.isModified('name')) return next();

    this.slug = slugify(this.name, { lower: true });

    next();
});

genreSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName email photo'
    });

    next();
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;