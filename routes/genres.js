const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// CONTROLLERS
const index = require('../controllers/genres/index');
const add = require('../controllers/genres/add');
const addLogic = require('../controllers/genres/addLogic');
const edit = require('../controllers/genres/edit');
const editLogic = require('../controllers/genres/editLogic');
const deleteGenre = require('../controllers/genres/delete');

// GET INDEX/GENRES ROUTE
router.get('/', auth, index);

// GET ADD GENRE 
router.get('/add', auth, add);

// POST GENRE LOGIC
router.post('/add', auth, addLogic);

// GET EDIT ROUTE
router.get('/edit/:id', auth, edit);

// PUT EDIT LOGIC
router.put('/edit/:id', auth, editLogic);

// DELETE GENRE ROUTE
router.delete('/delete/:id', auth, deleteGenre);

module.exports = router;