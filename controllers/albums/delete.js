const Album = require('../../models/Album');

module.exports = async (req, res) => {
    try {
        await Album.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Album Successfully Removed');
        res.redirect('/albums');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Operation Failed!');
        res.redirect('/albums')
    }
}