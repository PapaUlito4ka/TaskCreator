const express = require('express');
const passport = require('./passport');
const LocalStrategy = require('passport-local');

const { User, UserProfile } = require('../user/models');
const userService = require('../user/services');
const { handleApiError } = require('../error');

const router = express.Router();


router.get('/sign-up', (req, res, next) => {
    res.send('Sign up page');
});

router.post('/sign-up', (req, res, next) => {
    userService.createUser(req.body)
        .then(() => res.status(201).end())
        .catch(err => handleApiError(err, res, next));
});

router.get('/sign-in', (req, res, next) => {
    res.send(`Sign in page ${req.query.message}`);
});

router.post('/sign-in', (req, res, next) => {
    return passport.authenticate('local', (message, user, err, ...args) => {
        if (err) {
            handleApiError(err, res, next);
            return;
        }
        if (message) {
            handleApiError(message, res, next);
            return;
        }
        res.redirect('/');
    })(req, res, next);
});


module.exports = router;