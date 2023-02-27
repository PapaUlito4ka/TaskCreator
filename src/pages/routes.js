const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const userRouter = require('../user/routes');
const teamRouter = require('../team/routes');
const taskRouter = require('../task/routes');
const projectRouter = require('../project/routes');
const commentRouter = require('../comment/routes');
const { getHomePage } = require('./services');

router.use(middleware.isLoggedIn);

router.use('/user', userRouter);
router.use('/teams', teamRouter);
router.use('/tasks', taskRouter);
router.use('/projects', projectRouter);
router.use('/comments', commentRouter);

router.get('/', async (req, res, next) => {
    res.render('index.html', await getHomePage(req.session.user));
});


module.exports = router;