const _ = require('lodash');
const multer = require('multer');
const cloudinary = require('cloudinary');
const Album = require('../models/Album');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

const multerStorage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const multerFilter = function (req, file, cb) {
    // Accept image files only
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    }
    return cb(new AppError('Only image files are allowed', 400), false);
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

cloudinary.config({
    cloud_name: 'learntocodewithnode',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadAlbumCover = upload.single('cover');

exports.getAllAlbums = factory.getAll(Album);
exports.getAlbum = factory.getOne(Album);

exports.createAlbum = catchAsync(async (req, res, next) => {
    const { artist, title, genre, info, year, label, tracks } = req.body;
    // const albumObj = _.pick(req.body, ['artist', 'title', 'genre', 'info', 'year', 'label', 'tracks']);

    const result = await cloudinary.uploader.upload(req.file.path);
    const album = await Album.create({
        artist, title, genre, info, year, label, tracks,
        cover: result.secure_url,
        coverId: result.public_id
    });

    res.status(201).json({
        status: 'success',
        data: {
            album
        }
    });
});

exports.updateAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        return next(new AppError('No album found with that ID', 404));
    }

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

    res.status(200).json({
        status: 'success',
        data: {
            album
        }
    });
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
        return next(new AppError('No album found with that ID', 404));
    }

    await cloudinary.v2.uploader.destroy(album.coverId);
    album.remove();

    res.status(204).json({
        status: 'success',
        data: null
    });
});