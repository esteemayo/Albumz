const multer = require('multer');
const cloudinary = require('cloudinary');
const Album = require('../models/Album');
const Genre = require('../models/Genre');
const Review = require('../models/Review');
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
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadAlbumCover = upload.single('cover');

exports.albumOverview = catchAsync(async (req, res, next) => {
    const page = req.params.page * 1 || 1;
    const limit = 6;
    const skip = (page * limit) - limit;

    const albumsPromise = Album
        .find()
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');
    
    const countPromise = Album.countDocuments();

    const [albums, count] = await Promise.all([albumsPromise, countPromise]);

    const pages = Math.ceil(count / limit);

    if (!albums.length && skip) {
        req.flash('error_msg', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
        return res.redirect(`/albums/page/${pages}`);
    }

    res.status(200).render('albums/index', {
        title: 'Overview',
        albums,
        count,
        pages,
        page
    });
});

exports.addAlbum = catchAsync(async (req, res, next) => {
    const genres = await Genre.find();

    res.status(200).render('albums/add', {
        title: 'Create new album',
        genres
    });
});

exports.createAlbum = catchAsync(async (req, res, next) => {
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.cover = result.secure_url;
        req.body.coverId = result.public_id;
    }

    if (!req.body.user) req.body.user = req.user._id;

    await Album.create(req.body);
    req.flash('success_msg', 'Album saved successfully!');
    res.redirect('/albums');
});

exports.albumDetailPage = catchAsync(async (req, res, next) => {
    const album = await Album
        .findOne({ 'slug': req.params.slug })
        .populate({
            path: 'reviews',
            fields: 'review rating user'
        });

    if (!album) {
        return next(new AppError('No album found with that TITLE', 404));
    }

    res.status(200).render('albums/details', {
        title: album.title,
        album
    });
});

exports.editAlbumPage = catchAsync(async (req, res, next) => {
    const genresPromise = Genre.find();
    const albumPromise = Album.findOne({ 'slug': req.params.slug });

    const [genres, album] = await Promise.all([genresPromise, albumPromise]);

    if (!album) {
        return next(new AppError('No album found with that TITLE', 404));
    }

    res.status(200).render('albums/edit', {
        title: `Edit ${album.title}`,
        album,
        genres
    });
});

exports.updateAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (!album.coverId) {
        const result = await cloudinary.uploader.upload(req.file.path);
        album.cover = result.secure_url;
        album.coverId = result.public_id;
    }

    if (req.file) {
        try {
            await cloudinary.v2.uploader.destroy(album.coverId);
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            album.coverId = result.public_id;
            album.cover = result.secure_url;
        } catch (err) {
            req.flash('error_msg', err.message);
            return res.redirect('back');
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
    req.flash('success_msg', 'Album updated successfully');
    res.redirect(`/albums/details/${album.slug}`);
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
    const album = await Album.findById(req.params.id);

    if (!album) {
        return next(new AppError('No album found with that ID', 404));
    }

    if (album.coverId) {
        await cloudinary.uploader.destroy(album.coverId);
    }
    album.remove();
    req.flash('success_msg', 'Album successfully removed');
    res.redirect('/albums');
});

exports.getAlbumsByTag = catchAsync(async (req, res, next) => {
    const { tag } = req.params;
    const tagQuery = tag || { $exists: true };

    const tagsPromise = Album.getTagsList();
    const albumsPromise = Album.find({ tags: tagQuery });

    const [tags, albums] = await Promise.all([tagsPromise, albumsPromise]);

    res.status(200).render('albums/tags', {
        title: 'Tags',
        albums,
        tags,
        tag
    });
});

exports.getTopAlbums = catchAsync(async (req, res, next) => {
    const albums = await Album.getTopAlbums();

    res.status(200).render('albums/top', {
        title: 'Top albums ⭐',
        albums
    });
});

exports.getAllGenres = catchAsync(async (req, res, next) => {
    const genres = await Genre
        .find()
        .sort('-createdAt');

    res.status(200).render('genres/index', {
        title: 'Genre overview',
        genres
    });
});

exports.createGenre = catchAsync(async (req, res, next) => {
    if (!req.body.user) req.body.user = req.user._id;

    const genre = await Genre.findOne({ 'name': req.body.name });
    if (genre) {
        req.flash('error', 'Genre already exist, choose another one.');
        return res.redirect('/genres/add');
    }

    await Genre.create(req.body);
    req.flash('success_msg', 'Genre Saved');
    res.redirect('/genres');
});

exports.editGenrePage = catchAsync(async (req, res, next) => {
    const genre = await Genre.findOne({ 'slug': req.params.slug });

    if (!genre) {
        return next(new AppError('No genre found with that NAME', 404));
    }

    res.status(200).render('genres/edit', {
        title: `Edit ${genre.name}`,
        genre
    });
});

exports.updateGenre = catchAsync(async (req, res, next) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!genre) {
        return next(new AppError('No genre found with that ID', 404));
    }

    req.flash('success_msg', 'Genre successfully updated');
    res.redirect('/genres');
});

exports.deleteGenre = catchAsync(async (req, res, next) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
        return next(new AppError('No genre found with that ID', 404));
    }

    req.flash('success_msg', 'Genre successfully removed');
    res.redirect('/genres');
});

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.album) req.body.album = req.params.id;
    if (!req.body.user) req.body.user = req.user._id;

    await Review.create(req.body);
    req.flash('success_msg', '💃 Review saved!');
    res.redirect('back');
});

exports.index = (req, res) => {
    res.status(200).render('index', {
        title: 'Home Page'
    });
};

exports.addGenreForm = (req, res) => {
    res.status(200).render('genres/add', {
        title: 'Create new genre'
    });
};