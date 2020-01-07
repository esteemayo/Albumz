const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 4,
        max: 1024
    },
    confirm: {
        type: String,
        min: 4,
        max: 1024
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
});

module.exports = mongoose.model('User', userSchema);