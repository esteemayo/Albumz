const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        authController.protect,
        reviewController.getAllReviews
    )
    .post(
        authController.protect,
        reviewController.sendAlbumUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(
        validateObjectId,
        authController.protect,
        reviewController.getReview
    )
    .patch(
        validateObjectId,
        authController.protect,
        reviewController.updateReview
    )
    .delete(
        validateObjectId,
        authController.protect,
        reviewController.deleteReview
    );

module.exports = router;