const express = require('express');
const { handleApiError } = require('../error');
const { isLoggedIn } = require('../middleware');
const UserService = require('./services');


const router = express.Router();

router.use(isLoggedIn);

router.get('/', (req, res, next) => {
    UserService.profilePage(req.session.user)
        .then(user => res.render('user/profile.html', user))
        .catch(err => handleApiError(err, res, next));
});

router.get('/:id', (req, res, next) => {
    if (req.params.user.id === req.params.id) {
        res.redirect('/user');
        return;
    }
    UserService.userProfilePage(req.session.user, req.params.id)
        .then(user => res.render('user/profile.html', user))
        .catch(err => handleApiError(err, res, next));
});

router.patch('/', (req, res, next) => {
    UserService.updateUserProfile(req.session.user, req.body)
        .then(() => res.redirect('/user'))
        .catch(err => handleApiError(err, res, next))
});


module.exports = router;