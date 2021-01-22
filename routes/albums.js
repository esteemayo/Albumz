const express = require('express');
const albumController = require('../controllers/albumController');
const validateObjectId = require('../middleware/validateObjectId');
const reviewRouter = require('./reviews');

const router = express.Router();

router.use('/:albumId/reviews', reviewRouter);

router
    .route('/')
    .get(albumController.getAllAlbums)
    .post(
        albumController.uploadAlbumCover,
        albumController.createAlbum
    );

router
    .route('/:id')
    .get(
        validateObjectId,
        albumController.getAlbum
    )
    .patch(
        validateObjectId,
        albumController.uploadAlbumCover,
        albumController.updateAlbum
    )
    .delete(
        validateObjectId,
        albumController.deleteAlbum
    );

module.exports = router;