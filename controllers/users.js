
const User = require('../models/user');
// const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const keys = require("../config/keys");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.google.clientID,
//       clientSecret: keys.google.clientSecret,
//       callbackURL: "/auth/google/redirect"
//     },
//     accessToken => {
//       console.log("access token: ", accessToken);
//     }
//   )
// );

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to TourdeGlobe!');
            res.redirect('/destination');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/destination';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/destination');
}
