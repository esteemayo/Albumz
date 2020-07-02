const express = require('express');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', auth, viewController.index);

router.get('/albums', auth, viewController.albumOverview);

router.get('/albums/add', auth, viewController.addAlbum);

router.post('/albums/add', auth, viewController.uploadAlbumCover, viewController.createAlbum);

router.get('/albums/details/:id', auth, viewController.albumDetailPage);

router.get('/edit/:id', auth, viewController.editAlbumPage);

router.put('/edit/:id', auth, viewController.uploadAlbumCover, viewController.updateAlbum);

router.delete('/delete/:id', auth, viewController.deleteAlbum);

router.get('/genres', auth, viewController.getAllGenres);

router.get('/genres/add', auth, viewController.addGenreForm);

router.post('/genres/add', auth, viewController.createGenre);

router.get('/genres/edit/:id', auth, viewController.editGenrePage);

router.put('/genres/edit/:id', auth, viewController.updateGenre);

router.delete('/genres/delete/:id', auth, viewController.deleteGenre);

module.exports = router;