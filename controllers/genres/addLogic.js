const Genre = require('../../models/Genre');
const _ = require('lodash');

module.exports = async (req, res) => {
    try {
        const genres = { name: req.body.name, user: req.user.id };
        let genre = await Genre.findOne({ name: req.body.name });
        if (genre) {
            req.flash('error', 'Genre already exist, choose another one.');
            res.redirect('/genres/add');
        }
        genre = new Genre(_.pick(genres, ['name', 'user']));
        await genre.save();
        req.flash('success_msg', 'Genre Saved');
        res.redirect('/genres');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Something went wrong');
        res.redirect('/genres');
    }
}