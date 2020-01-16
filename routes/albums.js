const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: './public/images/uploads' });
const auth = require('../middleware/auth');

const multer = require('multer');
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    // Accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFilter });

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'learntocodewithnode',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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