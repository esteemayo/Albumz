const _ = require('lodash');
const Album = require('../../models/Album');

const multer = require('multer');
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    // Accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFilter });

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'learntocodewithnode',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async (req, res) => {
    cloudinary.uploader.upload(req.file.path, async (result) => {
        const album = new Album({
            artist: req.body.artist,
            title: req.body.title,
            genre: req.body.genre,
            info: req.body.info,
            year: req.body.year,
            label: req.body.label,
            tracks: req.body.tracks,
            cover: result.secure_url,
            coverId: result.public_id,
            user: req.user.id
        });

        try {
            await album.save();
            req.flash('success_msg', 'Album Saved');
            res.redirect('/albums');
        } catch (err) {
            console.log(err);
            req.flash('error_msg', 'Something went wrong');
            res.redirect('/albums');
        }
    });
    // // CHECK FILE UPLOAD
    // let cover;
    // if (req.file) {
    //     console.log('Uploading File...');
    //     cover = req.file.filename;
    // } else {
    //     console.log('No File Uploaded...');
    //     cover = 'noimage.jpg';
    // }

    // try {
    //     const albums = {
    //         artist: req.body.artist,
    //         title: req.body.title,
    //         genre: req.body.genre,
    //         info: req.body.info,
    //         year: req.body.year,
    //         label: req.body.label,
    //         tracks: req.body.tracks,
    //         cover: cover,
    //         user: req.user.id
    //     }

    //     let album = await Album.findOne({ title: req.body.title });
    //     if (album) {
    //         req.flash('error_msg', 'Album title already exist, choose another.');
    //         res.redirect('/albums/add');
    //     }
    //     album = new Album(_.pick(albums, ['artist', 'title', 'genre', 'info', 'year', 'label', 'tracks', 'cover', 'user']));

    //     await album.save();
    //     req.flash('success_msg', 'Album Saved');
    //     res.redirect('/albums');
    // } catch (err) {
    //     console.log(err);
    //     req.flash('error_msg', 'Something went wrong');
    //     res.redirect('/albums');
    // }
}