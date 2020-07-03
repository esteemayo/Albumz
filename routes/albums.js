const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router
    .route('/')
    .get(albumController.getAllAlbums)
    .post(
        albumController.uploadAlbumCover,
        albumController.createAlbum
    );

router
    .route('/:id')
    .get(albumController.getAlbum)
    .patch(
        albumController.uploadAlbumCover,
        albumController.updateAlbum
    )
    .delete(albumController.deleteAlbum);

module.exports = router;