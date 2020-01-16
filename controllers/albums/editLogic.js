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
    Album.findById(req.params.id, async (err, album) => {
        if (err) {
            console.log(err);
            return res.redirect('back');
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(album.coverId);
                    const result = await cloudinary.v2.uploader.upload(req.file.path);
                    album.coverId = result.public_id;
                    album.cover = result.secure_url;
                } catch (err) {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/albums')
                }
            }
            album.artist = req.body.artist;
            album.title = req.body.title;
            album.genre = req.body.genre;
            album.info = req.body.info;
            album.year = req.body.year;
            album.label = req.body.label;
            album.tracks = req.body.tracks;
            album.save();
            req.flash('success_msg', 'Album Updated');
            res.redirect(`/albums/details/${album._id}`);
        }
    });


    // const { artist, title, genre, info, year, label, tracks } = req.body;
    // // CHECK FILE UPLOAD
    // let cover;
    // if (req.file) {
    //     console.log('Uploading File...');
    //     cover = req.file.filename;
    // } else {
    //     console.log('No File Uploaded...');
    //     cover = 'noimage.jpg';
    // }

    // if (req.file) {
    //     try {
    //         const album = await Album.findByIdAndUpdate(req.params.id, {
    //             artist, title, genre, info, year, label, tracks, cover
    //         }, { new: true });
    //         req.flash('success_msg', 'Album Updated');
    //         res.redirect(`/albums/details/${album._id}`);
    //     } catch (err) {
    //         console.log(err);
    //         req.flash('error_msg', 'Something went wrong!');
    //         res.redirect('/albums');
    //     }
    // } else {
    //     try {
    //         const album = await Album.findByIdAndUpdate(req.params.id, {
    //             artist, title, genre, info, year, label, tracks
    //         }, { new: true });
    //         req.flash('success_msg', 'Album Updated');
    //         res.redirect(`/albums/details/${album._id}`);
    //     } catch (err) {
    //         console.log(err);
    //         req.flash('error_msg', 'Something went wrong!');
    //         res.redirect('/albums')
    //     }
    // }
}