/* eslint-disable */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// Models
const Review = require('../../models/Review');
const Album = require('../../models/Album');
const Genre = require('../../models/Genre');
const User = require('../../models/User');

dotenv.config({ path: './config.env' });

// MongoDB Atlas
const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// Database local
const dbLocal = process.env.DATABASE_LOCAL;

// MongoDB connection
// mongoose.connect(db, {
mongoose.connect(dbLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    // .then(() => console.log(`Connected to MongoDB → ${db}`));
    .then(() => console.log(`Connected to MongoDB → ${dbLocal}`));

// Read JSON file
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));
const albums = JSON.parse(fs.readFileSync(`${__dirname}/albums.json`, 'utf8'));
const genres = JSON.parse(fs.readFileSync(`${__dirname}/genres.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));

// Import data into DB
const importData = async () => {
    try {
        await Album.create(albums);
        await Genre.create(genres);
        await Review.create(reviews);
        await User.create(users, { validateBeforeSave: false });

        console.log('👍👍👍👍👍👍👍👍 Data successfully loaded! 👍👍👍👍👍👍👍👍');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit();
    }
};

// Delete all data from DB
const deleteData = async () => {
    try {
        console.log('😢😢 Goodbye Data...');

        await Album.deleteMany();
        await Genre.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();

        console.log('Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n');
        process.exit();
    } catch (err) {
        console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
        console.log(err);
        process.exit();
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}