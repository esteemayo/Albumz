const Review = require('../models/Review');
const factory = require('./handlerFactory');

exports.sendAlbumUserIds = (req, res, next) => {
    if (!req.body.album) req.body.album = req.params.id;
    if (!req.body.user) req.body.user = req.user._id;

    next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);