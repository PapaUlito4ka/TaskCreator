const express = require('express');
const { handleApiError } = require('../error');
const router = express.Router();

const middleware = require('../middleware');
const ApiService = require('./services');

// router.use(middleware.isLoggedIn);

router.get('/users', (req, res, next) => {
    ApiService.getAllUsers(req.query.exceptUserId)
        .then(users => res.json(users))
        .catch(err => handleApiError(err, res, next));
});





module.exports = router;