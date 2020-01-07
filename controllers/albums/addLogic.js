const _ = require('lodash');
const Album = require('../../models/Album');

module.exports = async (req, res) => {
    // CHECK FILE UPLOAD
    let cover;
    if (req.file) {
        console.log('Uploading File...');
        cover = req.file.filename;
    } else {
        console.log('No File Uploaded...');
        cover = 'noimage.jpg';
    }

    try {
        const albums = {
            artist: req.body.artist,
            title: req.body.title,
            genre: req.body.genre,
            info: req.body.info,
            year: req.body.year,
            label: req.body.label,
            tracks: req.body.tracks,
            cover: cover,
            user: req.user.id
        }

        let album = await Album.findOne({ title: req.body.title });
        if (album) {
            req.flash('error_msg', 'Album title already exist, choose another.');
            res.redirect('/albums/add');
        }
        album = new Album(_.pick(albums, ['artist', 'title', 'genre', 'info', 'year', 'label', 'tracks', 'cover', 'user']));

        await album.save();
        req.flash('success_msg', 'Album Saved');
        res.redirect('/albums');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Something went wrong');
        res.redirect('/albums');
    }
}