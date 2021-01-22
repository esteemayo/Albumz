/* eslint-disable */
const mongoose = require('mongoose');
const config = require('config');

// MongoDB Atlas
const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// Db local
const dbLocal = config.get('db');

module.exports = () => {
    mongoose.connect(dbLocal, {
    // mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(con => {
            // console.log(con.connections);
            // console.log(`MongoDB Connected → ${db}`)
            console.log(`MongoDB Connected → ${dbLocal}`)
        });
}