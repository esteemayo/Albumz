const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images/uploads' });
const auth = require('../middleware/auth');

// CONTROLLERS
const index = require('../controllers/albums/index');
const add = require('../controllers/albums/add');
const addLogic = require('../controllers/albums/addLogic');
const details = require('../controllers/albums/details');
const edit = require('../controllers/albums/edit');
const editLogic = require('../controllers/albums/editLogic');
const deleteAlbum = require('../controllers/albums/delete');

// GET INDEX/ALBUMS ROUTE
router.get('/', auth, index);

// GET ADD ALBUM ROUTE
router.get('/add', auth, add);

// POST ALBUM LOGIC
router.post('/add', auth, upload.single('cover'), addLogic);

// GET DETAILS[SHOW] ROUTE
router.get('/details/:id', auth, details);

// GET EDIT ROUTE
router.get('/edit/:id', auth, edit);

// PUT EDIT LOGIC
router.put('/edit/:id', auth, upload.single('cover'), editLogic);

// DELETE ALBUM ROUTE
router.delete('/delete/:id', auth, deleteAlbum);

module.exports = router;