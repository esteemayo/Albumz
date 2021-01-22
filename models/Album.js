const mongoose = require('mongoose');
const slugify = require('slugify');

const albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: [true, 'Album must have an artist']
    },
    title: {
        type: String,
        required: [true, 'Album must have must a title']
    },
    genre: {
        type: String,
        required: [true, 'Album must belong to a genre']
    },
    slug: String,
    info: {
        type: String,
        required: [true, 'Please provide the album info']
    },
    year: {
        type: String,
        required: [true, 'Album must have a year of release']
    },
    label: {
        type: String,
        required: [true, 'Please tell us your record label']
    },
    tracks: {
        type: Number,
        required: [true, 'Please tell us your album number of tracks']
    },
    tags: {
        type: Array,
        validate: {
            validator: function(val) {
                return val && val.length > 0;
            },
            message: 'Album should have at least one tag'
        }
    },
    cover: {
        type: String,
        default: 'albumdefault.jpg'
    },
    coverId: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'There must be a logged in user']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Improving read performance with index
albumSchema.index({ 
    artist: 1, 
    year: 1 
});

// Virtual populate reviews
albumSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'album'
});

albumSchema.pre('save', async function(next) {
    if (!this.isModified('title')) return next();

    this.slug = slugify(this.title, { lower: true });

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const albumWithSlug = await this.constructor.find({ 'slug': slugRegEx });

    if (albumWithSlug.length) {
        this.slug = `${this.slug}-${albumWithSlug.length + 1}`;
    }

    next();
});

// Populate user
albumSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName username email photo'
    });

    next();
});

albumSchema.statics.getTagsList = function () {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

albumSchema.statics.getTopAlbums = function () {
    return this.aggregate([
        // Looup albums and populate their reviews
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'album',
                as: 'reviews'
            }
        },
        // Filter for only items that have 2 or more reviews
        {
            $match: { 'reviews.1': { $exists: true } }
        },
        // Add the average reviews field($project OR $addFields)
        {
            $addFields: {
                title: '$$ROOT.title',
                reviews: '$$ROOT.reviews',
                slug: '$$ROOT.slug',
                cover: '$$ROOT.cover',
                averageRating: { $avg: '$reviews.rating' }
            }
        },
        // Sort it by our new field, highest reviews first
        {
            $sort: { averageRating: -1 }
        },
        // Limit to at most 10
        {
            $limit: 10
        }
    ]);
};

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;