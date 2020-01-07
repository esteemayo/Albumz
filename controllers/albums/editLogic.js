const Album = require('../../models/Album');

module.exports = async (req, res) => {
    const { artist, title, genre, info, year, label, tracks } = req.body;
    // CHECK FILE UPLOAD
    let cover;
    if (req.file) {
        console.log('Uploading File...');
        cover = req.file.filename;
    } else {
        console.log('No File Uploaded...');
        cover = 'noimage.jpg';
    }

    if (req.file) {
        try {
            const album = await Album.findByIdAndUpdate(req.params.id, {
                artist, title, genre, info, year, label, tracks, cover
            }, { new: true });
            req.flash('success_msg', 'Album Updated');
            res.redirect(`/albums/details/${album._id}`);
        } catch (err) {
            console.log(err);
            req.flash('error_msg', 'Something went wrong!');
            res.redirect('/albums');
        }
    } else {
        try {
            const album = await Album.findByIdAndUpdate(req.params.id, {
                artist, title, genre, info, year, label, tracks
            }, { new: true });
            req.flash('success_msg', 'Album Updated');
            res.redirect(`/albums/details/${album._id}`);
        } catch (err) {
            console.log(err);
            req.flash('error_msg', 'Something went wrong!');
            res.redirect('/albums')
        }
    }
}