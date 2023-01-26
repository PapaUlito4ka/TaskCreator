const express = require('express');

const router = express.Router();


router.get('/', (req, res, next) => {
    res.send('User profile page');
});

router.post('/', (req, res, next) => {
    res.send('User profile post method');
});

router.put('/', (req, res, next) => {
    res.send('User profile put method');
});

router.patch('/', (req, res, next) => {
    res.send('User profile patch method');
});

router.delete('/', (req, res, next) => {
    res.send('User profile delete method');
});


module.exports = router;