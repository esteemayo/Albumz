const Genre = require('../../models/Genre');

module.exports = async (req, res) => {
    try {
        await Genre.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Genre Removed');
        res.redirect('/genres');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Operation Failed');
        res.redirect('/genres');
    }
}