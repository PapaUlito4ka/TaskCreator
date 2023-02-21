const express = require('express');
const { handleApiError } = require('../error');
const TeamService = require('./services');


const router = express.Router();


router.get('/', (req, res, next) => {
    TeamService.teamsPage(req.session.user)
        .then(teams => res.render('team/teams.html', teams))
        .catch(err => handleApiError(err, res, next))
});

router.get('/founded', (req, res, next) => {
    TeamService.getFoundedTeams(req.session.user)
        .then(teams => res.json(teams))
        .catch(err => handleApiError(err, res, next))
});

router.post('/', (req, res, next) => {
    TeamService.createTeam(req.session.user, req.body)
        .then(() => res.redirect('/teams/founded'))
        .catch(err => handleApiError(err, res, next))
});

router.patch('/:id', (req, res, next) => {
    TeamService.updateTeam(req.session.user, req.params.id, req.body)
        .then(() => res.redirect('/teams/founded'))
        .catch(err => handleApiError(err, res, next))
});

router.get('/:id', (req, res, next) => {
    TeamService.teamPage(req.session.user, req.params.id)
        .then(team => res.render('team/team.html', team))
        .catch(err => handleApiError(err, res, next))
});

router.delete('/:id', (req, res, next) => {
    TeamService.deleteTeam(req.session.user, req.params.id)
        .then(() => res.redirect('/teams/founded'))
        .catch(err => handleApiError(err, res, next))
});


module.exports = router;