const express = require('express');
const session = require('express-session');
const RedisStorage = require('connect-redis')(session);
const redis = require('redis');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv').config();
const path = require('path');
const nunjucks = require('nunjucks');
const morgan = require('morgan');

const app = express();
const redisClient = redis.createClient({ url: process.env.REDIS_URI, legacyMode: true });

const authRouter = require('./src/auth/routes');
const pagesRouter = require('./src/pages/routes');
const apiRouter = require('./src/api/routes');

const PORT = process.env.PORT || 3000;

(async () => {
    mongoose.set('strictQuery', true);
    await redisClient.connect();
    await mongoose.connect(process.env.MONGO_URI);
    app
        .use('/static', express.static(path.join(__dirname, process.env.STATIC_URL)))
        .use(cookieParser())
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(session({
            store: new RedisStorage({
                client: redisClient,
                ttl: 3600
            }),
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            resave: true,
        }))
        .use(passport.authenticate('session'))
        .use(morgan('common'));
    nunjucks.configure('src/views', { express: app, autoescape: true });

    app.use('/api/v1', apiRouter);
    app.use('/auth', authRouter);
    app.use('/', pagesRouter);

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
})()
    .catch(console.error)