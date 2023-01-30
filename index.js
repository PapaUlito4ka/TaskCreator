const express = require('express');
const session = require('express-session');
const RedisStorage = require('connect-redis')(session);
const redis = require('redis');
const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('dotenv').config();
const path = require('path');

const app = express();
const redisClient = redis.createClient({ url: process.env.REDIS_URI, legacyMode: true });

const authRouter = require('./src/auth/routes');

const PORT = process.env.PORT || 3000;

(async () => {
    mongoose.set('strictQuery', true);

    await redisClient.connect();
    await mongoose.connect(process.env.MONGO_URI);

    app
        .use('/static', express.static(path.join(__dirname, process.env.STATIC_URL)))
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(session({
            store: new RedisStorage({
                client: redisClient
            }),
            secret: process.env.SESSION_SECRET,
            saveUninitialized: true,
            resave: false,
        }))
        .use(passport.initialize())
        .use(passport.session());

    app.use('/auth', authRouter);

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
})()
    .catch(console.error)