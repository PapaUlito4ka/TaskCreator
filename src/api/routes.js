const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const userRouter = require('../user/routes');
const teamRouter = require('../team/routes');
const taskRouter = require('../task/routes');
const projectRouter = require('../project/routes');
const commentRouter = require('../comment/routes');

router.use(middleware.isLoggedIn);

router.use('/user', userRouter);
router.use('/team', teamRouter);
router.use('/task', taskRouter);
router.use('/project', projectRouter);
router.use('/comment', commentRouter);

router.get('/', (req, res, next) => {
    res.render('index.html');
});


module.exports = router;