const passport = require('passport');
const LocalStrategy = require('passport-local');

const { User } = require('../user/models');


passport.use(new LocalStrategy((email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (!user.verifyPassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


module.exports = passport;