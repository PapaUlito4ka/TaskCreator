const express = require('express');
const { handleApiError } = require('../error');
const { isLoggedIn } = require('../middleware');
const CommentService = require('./services');


const router = express.Router();

router.use(isLoggedIn);

router.post('/', (req, res, next) => {
    CommentService.createComment(req.session.user, req.body)
        .then(() => res.redirect(`/tasks/${req.body.task}`))
        .catch(err => handleApiError(err, res, next));
});

router.put('/:id', (req, res, next) => {
    CommentService.updateComment(req.session.user, req.params.id, req.body)
        .then(comment => res.json(comment))
        .catch(err => handleApiError(err, res, next));
});

router.get('/:id/update', (req, res, next) => {
    CommentService.updateCommentPage(req.session.user, req.params.id)
        .then(comment => res.render('comment/update_comment.html', comment))
        .catch(err => handleApiError(err, res, next));
});

router.delete('/:id', (req, res, next) => {
    CommentService.deleteComment(req.session.user, req.params.id, req.body)
        .then(comment => res.json(comment))
        .catch(err => handleApiError(err, res, next));
});


module.exports = router;