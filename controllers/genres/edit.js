const Genre = require('../../models/Genre');

module.exports = async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        res.render('genres/edit', { genre });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', err.message);
        res.redirect('/genres');
    }
}