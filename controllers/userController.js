const _ = require('lodash');
const User = require('../models/User');
const Album = require('../models/Album');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.account = (req, res) => {
    res.status(200).render('users/account', {
        title: 'Account settings'
    });
}

exports.updateUserData = catchAsync(async (req, res, next) => {
    const filterBody = _.pick(req.body, ['firstName', 'lastName', 'email', 'username']);
    if (req.file) filterBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: filterBody }, {
        new: true,
        runValidators: true
    });

    req.flash('success_msg', `💃 Successfully updated ${updatedUser.fullName}'s account!`);
    res.redirect('/account');
});

exports.profile = catchAsync(async (req, res, next) => {
    const userProfile = await User.findOne({ 'username': req.params.username });
    const albums = await Album
        .find({ 'user': userProfile })
        .sort('-createdAt');

    if (!userProfile) {
        req.flash('error_msg', 'Oops! No user with the username address found.');
        return res.redirect('back');
    }

    res.status(200).render('users/profile', {
        title: `${userProfile.fullName} profile`,
        albums,
        userProfile
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.redirect('back');
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: `This route is not defined! Please use ${req.protocol}://${req.get('host')}/users/register instead`
    });
};

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);