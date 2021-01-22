const Album = require('../models/Album');
const Genre = require('../models/Genre');
const catchAsync = require('../utils/catchAsync');

exports.albumOwner = catchAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
        const album = await Album.findOne({ 'slug': req.params.slug  });

        if (!album) {
            req.flash('error_msg', 'No album found');
            return res.redirect('back');
        }

        if (album.user.equals(req.user._id) || req.user.role === 'admin') return next();

        req.flash('error_msg', `Oops! You don't have permission to perform that operation`);
        return res.redirect('/albums');
    }
    req.flash('error_msg', 'Oops! You need to be logged in to do that');
    res.redirect('back');
});

exports.genreOwner = catchAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
        const genre = await Genre.findOne({ 'slug': req.params.slug  });
    
        if (!genre) {
            req.flash('error_msg', 'No genre found');
            return res.redirect('back');
        }

        if (genre.user.equals(req.user._id) || req.user.role === 'admin') return next();
    
        req.flash('error_msg', `Oops! You don't have permission to perform that operation`);
        return res.redirect('/genres');
    }
    req.flash('error_msg', 'Oops! You need to be logged in to do that');
    res.redirect('back');
});