const Genre = require('../../models/Genre');

module.exports = async (req, res) => {
    try {
        const genres = await Genre
            .find({ user: req.user.id })
            .populate('user');
        res.render('genres/index', { genres });
    } catch (err) {
        console.log(err);
    }
}