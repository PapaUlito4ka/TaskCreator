const express = require('express');


const router = express.Router();


router.get('/', (req, res, next) => {
    res.send('Projects page');
});

router.get('/leaded', (req, res, next) => {
    res.send('Entrusted projects page');
});

router.post('/', (req, res, next) => {
    res.send('Create projects page');
});

router.patch('/:id', (req, res, next) => {
    res.send('Patch project page');
});

router.get('/:id', (req, res, next) => {
    res.send('Get project page');
});

router.delete('/:id', (req, res, next) => {
    res.send('Delete project page');
});


module.exports = router;