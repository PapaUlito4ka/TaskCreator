const express = require('express');
const { handleApiError } = require('../error');
const { isLoggedIn } = require('../middleware');
const UserService = require('./services');


const router = express.Router();

router.use(isLoggedIn);

router.get('/', (req, res, next) => {
    UserService.getUserProfile(req.session.user)
        .then(userJson => res.json(userJson))
        .catch(err => handleApiError(err, res, next));
});

router.patch('/', (req, res, next) => {
    UserService.updateUserProfile(req.session.user, req.body)
        .then(() => res.redirect('/user'))
        .catch(err => handleApiError(err, res, next))
});


module.exports = router;