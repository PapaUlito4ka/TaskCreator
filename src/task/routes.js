const express = require('express');
const { handleApiError } = require('../error');
const TaskService = require('./services');


const router = express.Router();


router.get('/', (req, res, next) => {
    TaskService.tasksPage(req.session.user)
        .then(tasks => res.render('task/tasks.html', tasks))
        .catch(err => handleApiError(err, res, next))
});

router.get('/entrusted', (req, res, next) => {
    TaskService.getEntrustedTasks(req.session.user)
        .then(tasks => res.json(tasks))
        .catch(err => handleApiError(err, res, next))
});

router.get('/create', (req, res, next) => {
    res.render('task/create_task.html', {
        'userSession': req.session.user
    });
});

router.get('/:id/update', (req, res, next) => {
    TaskService.updateTaskPage(req.session.user, req.params.id)
        .then(task => res.render('task/update_task.html', task))
        .catch(err => handleApiError(err, res, next));
});

router.post('/', (req, res, next) => {
    TaskService.createTask(req.session.user, req.body)
        .then(() => res.redirect('/tasks'))
        .catch(err => handleApiError(err, res, next))
});

router.put('/:id', (req, res, next) => {
    TaskService.updateTask(req.session.user, req.params.id, req.body)
        .then(task => res.json(task))
        .catch(err => handleApiError(err, res, next))
});

router.get('/:id', (req, res, next) => {
    TaskService.taskPage(req.session.user, req.params.id)
        .then(task => res.render('task/task.html', task))
        .catch(err => handleApiError(err, res, next))
});

router.delete('/:id', (req, res, next) => {
    TaskService.deleteTask(req.session.user, req.params.id)
        .then(task => res.json(task))
        .catch(err => handleApiError(err, res, next))
});


module.exports = router;