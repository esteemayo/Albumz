const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review cannot be empty'],
        minlength: [30, 'A review must have more or equal than 30 characters']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must not be below 1.0'],
        max: [5, 'Rating must not be above 5.0']
    },
    album: {
        type: mongoose.Types.ObjectId,
        ref: 'Album',
        required: [true, 'A review must belong to a album']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

reviewSchema.index({ album: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName username email photo'
    });

    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;