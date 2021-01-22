const express = require('express');
const middleware = require('../middleware/index');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', viewController.index);

router.get('/albums', 
    authController.protect,
    viewController.albumOverview
);

router.get('/albums/page/:page',
    authController.protect,
    viewController.albumOverview
)

router
    .route('/albums/add')
    .get(
        authController.protect,
        viewController.addAlbum
    )
    .post( 
        authController.protect,
        viewController.uploadAlbumCover,
        viewController.createAlbum
    );

router.get('/albums/tags',
    authController.protect,
    viewController.getAlbumsByTag
);

router.get('/albums/tags/:tag',
    authController.protect,
    viewController.getAlbumsByTag
);

router.get('/albums/top',
    authController.protect,
    viewController.getTopAlbums
);

router.post('/albums/:id/reviews',
    validateObjectId,
    authController.protect,
    viewController.createReview
);

router.get('/albums/details/:slug',
    authController.protect,
    viewController.albumDetailPage
);

router.get('/albums/edit/:slug', 
    authController.protect,
    middleware.albumOwner,
    viewController.editAlbumPage
);

router.put('/albums/edit/:id',
    validateObjectId,
    authController.protect,
    viewController.uploadAlbumCover,
    viewController.updateAlbum
);

router.delete('/albums/delete/:id',
    validateObjectId,
    authController.protect,
    viewController.deleteAlbum
);

router.get('/genres', 
    authController.protect,
    viewController.getAllGenres
);

router
    .route('/genres/add')
    .get(
        authController.protect,
        viewController.addGenreForm
    )
    .post(
        authController.protect,
        viewController.createGenre
    );

router.get('/genres/edit/:slug', 
    authController.protect,
    middleware.genreOwner,
    viewController.editGenrePage
);

router.put('/genres/edit/:id',
    validateObjectId,
    authController.protect,
    viewController.updateGenre
);

router.delete('/genres/delete/:id',
    validateObjectId,
    authController.protect,
    viewController.deleteGenre
);

module.exports = router;