const express = require('express');
const passport = require('./passport');

const UserService = require('../user/services');
const { isNotLoggedIn, isLoggedIn } = require('../middleware');
const { handleApiError } = require('../error');

const router = express.Router();


router.get('/sign-up', isNotLoggedIn, (req, res, next) => {
    res.render('auth/sign-up.html');
});

router.post('/sign-up', isNotLoggedIn, (req, res, next) => {
    UserService.createUser(req.body)
        .then(() => res.redirect('/auth/sign-in'))
        .catch(err => handleApiError(err, res, next));
});

router.get('/sign-in', isNotLoggedIn, (req, res, next) => {
    res.render('auth/sign-in.html');
});

router.post('/sign-in', isNotLoggedIn, (req, res, next) => {
    return passport.authenticate('local', (message, user, err, ...args) => {
        if (err) {
            handleApiError(err, res, next);
            return;
        }
        if (message) {
            handleApiError(message, res, next);
            return;
        }
        req.session.user = user;
        res.redirect('/');
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    if (req.session.user) {
        req.session.destroy();
    }
    res.redirect('/auth/sign-in');
});


module.exports = router;