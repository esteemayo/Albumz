const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: [true, 'An album must have an artist']
    },
    title: {
        type: String,
        required: [true, 'An album must have must a title']
    },
    genre: {
        type: String,
        required: [true, 'An album must belong to a genre']
    },
    info: {
        type: String,
        required: [true, 'Please provide the album info']
    },
    year: {
        type: String,
        required: [true, 'An album must have a year of release']
    },
    label: {
        type: String,
        required: [true, 'Please tell us your record label']
    },
    tracks: {
        type: String,
        required: [true, 'Please tell us your album number of tracks']
    },
    cover: String,
    coverId: String,
    user: {
        type: String,
        required: [true, 'There must be a logged in user']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

albumSchema.index({ artist: 1, year: 1 });

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;