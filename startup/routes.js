const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const path = require('path');
const hpp = require('hpp');

const globalErrorHandler = require('../controllers/errorController');
const albumRoute = require('../routes/albums');
const AppError = require('../utils/appError');
const genreRoute = require('../routes/genre');
const userRoute = require('../routes/users');
const viewRoute = require('../routes/view');

module.exports = app => {
    require('../config/passport')(passport);

    // Implement cors
    app.use(cors());

    // Access-Control-Allow-Origin
    app.options('*', cors());

    // View engine
    app.set('views', path.join(`${__dirname}/../views`));
    app.set('view engine', 'ejs');

    // Set security http headers
    app.use(helmet());

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Limit request from same api
    const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,   // 1hr
        message: 'Too many requests from this IP, Please try again in an hour!'
    });

    app.use('/api', limiter);

    // Express body parser middleware
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Cookie parser middleware
    app.use(cookieParser());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization 
    app.use(xss());

    // Prevent parameter pollutio
    app.use(hpp({
        whitelist: [
            'artist',
            'name',
            'title',
            'genre',
            'info',
            'year',
            'tracks'
        ]
    }));

    // Comoression middleware
    app.use(compression());

    // Serving static files
    app.use(express.static(path.join(__dirname, '../public')));

    // Express session middleware
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());


    // Method override middleware
    app.use(methodOverride('_method'));

    // Connect flash middleware
    app.use(flash());

    // Global variables
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        res.locals.page = req.url;
        next();
    });

    // Test middleware
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });

    // Route middleware
    app.use('/', viewRoute);
    app.use('/', userRoute);
    app.use('/api/v1/albums', albumRoute);
    app.use('/api/v1/genres', genreRoute);

    app.all('*', (req, res, next) => {
        return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });

    app.use(globalErrorHandler);
}