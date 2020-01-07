const Genre = require('../../models/Genre');

module.exports = async (req, res) => {
    try {
        const genres = await Genre.find({});
        res.render('albums/add', { genres });
    } catch (err) {
        console.log(err);
    }
}