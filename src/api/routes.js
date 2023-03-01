const express = require('express');
const { handleApiError } = require('../error');
const router = express.Router();

const ApiService = require('./services');


router.get('/users', (req, res, next) => {
    ApiService.getAllUsers(req.query.exceptUserId)
        .then(users => res.json(users))
        .catch(err => handleApiError(err, res, next));
});

router.get('/users/:userId/teams', (req, res, next) => {
    ApiService.getUserTeams(req.params.userId)
        .then(teams => res.json(teams))
        .catch(err => handleApiError(err, res, next));
});

router.get('/teams/:teamId/members', (req, res, next) => {
    ApiService.getTeamMembers(req.params.teamId)
        .then(members => res.json(members))
        .catch(err => handleApiError(err, res, next));
});

router.get('/users/:userId/projects', (req, res, next) => {
    ApiService.getUserProjects(req.params.userId)
        .then(projects => res.json(projects))
        .catch(err => handleApiError(err, res, next));
});

router.get('/projects/:projectId/workers', (req, res, next) => {
    ApiService.getProjectWorkers(req.params.projectId)
        .then(workers => res.json(workers))
        .catch(err => handleApiError(err, res, next));
});


module.exports = router;