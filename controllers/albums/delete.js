const Album = require('../../models/Album');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'learntocodewithnode',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        await cloudinary.v2.uploader.destroy(album.coverId);
        album.remove();
        req.flash('success_msg', 'Album Successfully Removed');
        res.redirect('/albums');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Operation Failed!');
        res.redirect('/albums');
    }
}