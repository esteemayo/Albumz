const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A genre must have a name']
    },
    user: {
        type: String,
        required: [true, 'There must be a logged in user']
    }
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;