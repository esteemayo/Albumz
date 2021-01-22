const express = require('express');
const genreController = require('../controllers/genreController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router
    .route('/')
    .get(genreController.getAllGenres)
    .post(genreController.createGenre);

router
    .route('/:id')
    .get(
        validateObjectId,
        genreController.getGenre
    )
    .patch(
        validateObjectId,
        genreController.updateGenre
    )
    .delete(
        validateObjectId,
        genreController.deleteGenre
    );

module.exports = router;