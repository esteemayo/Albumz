const Album = require('../../models/Album');

module.exports = async (req, res) => {
    try {
        const albums = await Album.find({ user: req.user.id });
        res.render('albums/index', { albums });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', err.message);
    }
}