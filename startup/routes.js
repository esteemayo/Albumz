require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const index = require('../routes/index');
const albums = require('../routes/albums');
const genres = require('../routes/genres');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = app => {
    require('../config/passport')(passport);

    // VIEW ENGINE
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    // LOGGER MIDDLEWARE
    app.use(logger('dev'));

    // BODY PARSER MIDDLEWARE
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // EXPRESSS SESSION
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    // PASSPORT MIDDLEWARE
    app.use(passport.initialize());
    app.use(passport.session());

    // PUBLIC FOLDER
    app.use(express.static(path.join(__dirname, '../public')));

    // METHOD OVERRIDE MIDDLEWARE
    app.use(methodOverride('_method'));

    // CONNECT FLASH
    app.use(flash());

    // GLOBAL VARIABLES
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        res.locals.page = req.url;
        next();
    });

    // ROUTE MIDDLEWARE
    app.use('/', index);
    app.use('/albums', albums);
    app.use('/genres', genres);
    app.use('/auth', auth);
    app.use('/users/register', users);
}