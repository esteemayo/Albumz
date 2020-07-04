const _ = require('lodash');
const multer = require('multer');
const cloudinary = require('cloudinary');
const Album = require('../models/Album');
const Genre = require('../models/Genre');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

cloudinary.config({
    cloud_name: 'learntocodewithnode',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadAlbumCover = upload.single('cover');

exports.albumOverview = catchAsync(async (req, res, next) => {
    const albums = await Album.find({ user: req.user.id });

    res.status(200).render('albums/index', {
        title: 'Index page',
        albums
    });
});

exports.addAlbum = catchAsync(async (req, res, next) => {
    const genres = await Genre.find();
    res.status(200).render('albums/add', {
        title: 'Add new album to collection',
        genres
    });
});

exports.createAlbum = catchAsync(async (req, res, next) => {
    const { artist, title, genre, info, year, label, tracks } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path);
    const album = await Album.create({
        artist,
        title,
        genre,
        info,
        year,
        label,
        tracks,
        cover: result.secure_url,
        coverId: result.public_id,
        user: req.user.id
    });

    req.flash('success_msg', 'Album Saved');
    res.status(201).redirect('/albums');
});

exports.albumDetailPage = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        return next(new AppError('No album found with that ID', 404));
    }

    res.status(200).render('albums/details', {
        title: album.title,
        album
    });
});

exports.editAlbumPage = catchAsync(async (req, res, next) => {
    const genres = await Genre.find();
    const album = await Album.findById(req.params.id);

    if (!album) {
        return next(new AppError('No album found with that ID', 404));
    }

    res.status(200).render('albums/edit', {
        title: 'Edit album',
        album,
        genres
    });
});

exports.updateAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (req.file) {
        await cloudinary.v2.uploader.destroy(album.coverId);
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        album.coverId = result.public_id;
        album.cover = result.secure_url;
    }

    album.artist = req.body.artist;
    album.title = req.body.title;
    album.genre = req.body.genre;
    album.info = req.body.info;
    album.year = req.body.year;
    album.label = req.body.label;
    album.tracks = req.body.tracks;
    await album.save();

    req.flash('success_msg', 'Album Updated');
    res.status(200).redirect(`/albums/details/${album._id}`);
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        return next(new AppError('No album found with that ID', 404));
    }

    await cloudinary.v2.uploader.destroy(album.coverId);
    album.remove();
    req.flash('success_msg', 'Album Successfully Removed');
    res.status(204).redirect('/albums');
});

exports.getAllGenres = catchAsync(async (req, res, next) => {
    const genres = await Genre.find({ user: req.user.id }).populate('user');

    res.status(200).render('genres/index', {
        title: 'All genres',
        genres
    });
});

exports.createGenre = catchAsync(async (req, res, next) => {
    const genreObj = { name: req.body.name, user: req.user.id };

    let genre = await Genre.findOne({ name: req.body.name });
    if (genre) {
        req.flash('error', 'Genre already exist, choose another one.');
        res.redirect('/genres/add');
    }

    genre = await Genre.create(genreObj);
    req.flash('success_msg', 'Genre Saved');
    res.status(201).redirect('/genres');
});

exports.editGenrePage = catchAsync(async (req, res, next) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
        return next(new AppError('No genre found with that ID', 404));
    }

    res.status(200).render('genres/edit', {
        title: 'Edit genre',
        genre
    });
});

exports.updateGenre = catchAsync(async (req, res, next) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true,
        runValidators: true
    });

    if (!genre) {
        return next(new AppError('No genre found with that ID', 404));
    }

    req.flash('success_msg', 'Genre Updated');
    res.status(200).redirect('/genres');
});

exports.deleteGenre = catchAsync(async (req, res, next) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
        return next(new AppError('No genre found with that ID', 404));
    }

    req.flash('success_msg', 'Genre Removed');
    res.status(204).redirect('/genres');
});

exports.index = (req, res) => {
    res.status(200).render('index', {
        title: 'Home Page'
    });
};

exports.addGenreForm = (req, res) => {
    res.status(200).render('genres/add', {
        title: 'Add new album'
    });
};