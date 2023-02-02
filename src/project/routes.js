const express = require('express');
const { handleApiError } = require('../error');
const ProjectService = require('./services');


const router = express.Router();


router.get('/', (req, res, next) => {
    ProjectService.getProjects(req.session.user)
        .then(projects => res.json(projects))
        .catch(err => handleApiError(err, res, next))
});

router.get('/leaded', (req, res, next) => {
    ProjectService.getLeadedProjects(req.session.user)
        .then(projects => res.json(projects))
        .catch(err => handleApiError(err, res, next))
});

router.post('/', (req, res, next) => {
    ProjectService.createProject(req.session.user, req.body)
        .then(() => res.redirect('/projects/leaded'))
        .catch(err => handleApiError(err, res, next))
});

router.patch('/:id', (req, res, next) => {
    ProjectService.updateProject(req.session.user, req.params.id, req.body)
        .then(() => res.redirect('/projects/leaded'))
        .catch(err => handleApiError(err, res, next))
});

router.get('/:id', (req, res, next) => {
    ProjectService.getProject(req.session.user, req.params.id)
        .then(() => res.redirect('/projects/leaded'))
        .catch(err => handleApiError(err, res, next))
});

router.delete('/:id', (req, res, next) => {
    ProjectService.deleteProject(req.session.user, req.params.id)
        .then(() => res.redirect('/projects/leaded'))
        .catch(err => handleApiError(err, res, next))
});


module.exports = router;