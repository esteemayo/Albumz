const express = require('express');
const genreController = require('../controllers/genreController');

const router = express.Router();

router
    .route('/')
    .get(genreController.getAllGenres)
    .post(genreController.createGenre);

router
    .route('/:id')
    .get(genreController.getGenre)
    .patch(genreController.updateGenre)
    .delete(genreController.deleteGenre);

module.exports = router;