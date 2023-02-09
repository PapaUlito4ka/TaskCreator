
module.exports.isLoggedIn = function (req, res, next) {
    if (req.session.user) next();
    else res.redirect('/auth/sign-in');
};

module.exports.isNotLoggedIn = function (req, res, next) {
    if (req.session.user) res.redirect('/');
    else next();
};