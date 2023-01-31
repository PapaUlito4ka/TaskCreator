const express = require('express');
const { handleApiError } = require('../error');
const { isLoggedIn } = require('../middleware');
const { getUserProfile } = require('./services');


const router = express.Router();

router.use(isLoggedIn);

router.get('/', (req, res, next) => {
    getUserProfile(req.session.user)
        .then(userJson => res.json(userJson))
        .catch(err => handleApiError(err, res, next));
});

router.patch('/', (req, res, next) => {
    res.send('User profile patch method');
});


module.exports = router;