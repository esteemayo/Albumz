const Album = require('../../models/Album');
const Genre = require('../../models/Genre');

module.exports = async (req, res) => {
    try {
        const genres = await Genre.find({});
        const album = await Album.findById(req.params.id);
        res.render('albums/edit', { album, genres });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Something went wrong!');
        res.redirect('/albums');
    }
}