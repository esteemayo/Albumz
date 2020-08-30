const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A genre must have a name'],
        unique: true
    },
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

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;