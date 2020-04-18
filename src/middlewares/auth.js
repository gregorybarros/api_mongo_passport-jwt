const passport = require("passport")

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const User = require("../models/User")

const config = require("../config/config")

var opts = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
}

module.exports = () => {
    const strategy = new JwtStrategy(opts, async function(payload, done) {

        await User.findById(payload._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    })
    passport.use(strategy)

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate("jwt", config.jwtSession)

    }
}
