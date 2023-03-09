const express = require('express');
const { handleApiError } = require('../error');
const { Project } = require('./models');
const ProjectService = require('./services');


const router = express.Router();


router.get('/', (req, res, next) => {
    ProjectService.projectsPage(req.session.user)
        .then(projects => res.render('project/projects.html', projects))
        .catch(err => handleApiError(err, res, next))
});

router.get('/leaded', (req, res, next) => {
    ProjectService.getLeadedProjects(req.session.user)
        .then(projects => res.json(projects))
        .catch(err => handleApiError(err, res, next))
});

router.get('/create', (req, res, next) => {
    res.render('project/create_project.html', {
        'userSession': req.session.user
    });
});

router.get('/:id/update', (req, res, next) => {
    ProjectService.updateProjectPage(req.session.user, req.params.id)
        .then(project => res.render('project/update_project.html', project))
        .catch(err => handleApiError(err, res, next));
});

router.post('/', (req, res, next) => {
    ProjectService.createProject(req.session.user, req.body)
        .then(() => res.redirect('/projects'))
        .catch(err => handleApiError(err, res, next))
});

router.put('/:id', (req, res, next) => {
    ProjectService.updateProject(req.session.user, req.params.id, req.body)
        .then(project => res.json(project))
        .catch(err => handleApiError(err, res, next))
});

router.get('/:id', (req, res, next) => {
    ProjectService.projectPage(req.session.user, req.params.id)
        .then(project => res.render('project/project.html', project))
        .catch(err => handleApiError(err, res, next))
});

router.delete('/:id', (req, res, next) => {
    ProjectService.deleteProject(req.session.user, req.params.id)
        .then(() => res.redirect('/projects/leaded'))
        .catch(err => handleApiError(err, res, next))
});


module.exports = router;