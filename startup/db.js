const mongoose = require('mongoose');
const config = require('config');

module.exports = () => {
    mongoose.connect(config.get('db'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(con => {
            // console.log(con.connections);
            console.log('MongoDB Connected...')
        })
        .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err}`));
}