const jimp = require('jimp');
const uuid = require('uuid');
const multer = require('multer');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb){
        if (file.mimetype.startsWith('image')) {
            return cb(null, true);
        }
        cb(new AppError('Only image files are allowed', 400), false);
    }
};

const upload = multer(multerOptions);

exports.upload = upload.single('photo');

exports.resize = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const ext = req.file.mimetype.split('/')[1];
    req.file.filename = `${uuid.v4()}.${ext}`;

    const photo = await jimp.read(req.file.buffer);
    photo.resize(500, 500);
    photo.write(`public/img/users/${req.file.filename}`);

    next();
});