const express = require('express');


const router = express.Router();


router.get('/', (req, res, next) => {
    res.send('Team page');
});

router.get('/leaded', (req, res, next) => {
    res.send('Entrusted team page');
});

router.post('/', (req, res, next) => {
    res.send('Create team page');
});

router.patch('/:id', (req, res, next) => {
    res.send('Patch team page');
});

router.get('/:id', (req, res, next) => {
    res.send('Get team page');
});

router.delete('/:id', (req, res, next) => {
    res.send('Delete team page');
});


module.exports = router;