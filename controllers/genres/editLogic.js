const Genre = require('../../models/Genre');

module.exports = async (req, res) => {
    try {
        await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true
        });

        req.flash('success_msg', 'Genre Updated');
        res.redirect('/genres');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Something went wrong.');
        res.redirect('/genres');
    }
}