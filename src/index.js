const express = require('express');
const session = require('express-session');
const RedisStorage = require('connect-redis')(session);
const redis = require('redis');
const dotenv = require('dotenv').config();

const app = express();
const redistClient = redis.createClient();

const PORT = process.env.PORT || 3000;

(async () => {
    await redistClient.connect();
    
    app
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        // .use(session({
        //     store: new RedisStorage({
        //         host: process.env.REDIS_HOST,
        //         port: process.env.REDIS_PORT,
        //         client: redistClient,
        //         ttl: 120
        //     }),
        //     secret: process.env.SESSION_SECRET,
        //     saveUninitialized: true,
        //     resave: false,
        // }));


    app.get('/', async (req, res, next) => {
        res.send('Hello world');
    });

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
})();