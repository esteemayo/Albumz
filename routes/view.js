const express = require('express');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', authController.protect, viewController.index);

router.get('/albums', authController.protect, viewController.albumOverview);

router.get('/albums/add', authController.protect, viewController.addAlbum);

router.post('/albums/add', authController.protect, viewController.uploadAlbumCover, viewController.createAlbum);

router.get('/albums/details/:id', authController.protect, viewController.albumDetailPage);

router.get('/edit/:id', authController.protect, viewController.editAlbumPage);

router.put('/edit/:id', authController.protect, viewController.uploadAlbumCover, viewController.updateAlbum);

router.delete('/delete/:id', authController.protect, viewController.deleteAlbum);

router.get('/genres', authController.protect, viewController.getAllGenres);

router.get('/genres/add', authController.protect, viewController.addGenreForm);

router.post('/genres/add', authController.protect, viewController.createGenre);

router.get('/genres/edit/:id', authController.protect, viewController.editGenrePage);

router.put('/genres/edit/:id', authController.protect, viewController.updateGenre);

router.delete('/genres/delete/:id', authController.protect, viewController.deleteGenre);

module.exports = router;