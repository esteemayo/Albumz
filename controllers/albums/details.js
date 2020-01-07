const Album = require('../../models/Album');

module.exports = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        res.render('albums/details', { album });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Something went wrong. Try again');
        res.redirect('/albums');
    }
}