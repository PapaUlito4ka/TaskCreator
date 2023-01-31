const express = require('express');


const router = express.Router();


router.get('/', (req, res, next) => {
    res.send('Tasks page');
});

router.get('/entrusted', (req, res, next) => {
    res.send('Entrusted tasks page');
});

router.post('/', (req, res, next) => {
    res.send('Create tasks page');
});

router.patch('/:id', (req, res, next) => {
    res.send('Patch task page');
});

router.get('/:id', (req, res, next) => {
    res.send('Get task page');
});

router.delete('/:id', (req, res, next) => {
    res.send('Delete task page');
});


module.exports = router;