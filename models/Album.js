const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    tracks: {
        type: String,
        required: true
    },
    cover: {
        type: String
    },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Album', albumSchema);