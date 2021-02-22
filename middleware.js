const { DestinationSchema, reviewSchema } = require('./schemas.js');
const expressError = require('./utils/expressError');
const Destination = require('./models/destination');
const Review = require('./models/review');
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// module.exports.googleLoggedIn = (req, res, next) => {
//     if (!passport.authenticate("google") ) {
//      req.session.returnTo = req.originalUrl
//         req.flash('error', 'You must be signed in first!');
//          res.redirect('/login');
//     }
//   else
//   {console.log('ss');
//   res.redirect('/new');
//   next();
// }
   


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated() ) {
     req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }

    next();
}

module.exports.validateDestination = (req, res, next) => {
    const { error } = DestinationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');

        throw new expressError(msg, 400);
    } else
        next();
}



module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else
        next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const place = await Destination.findById(id);
    if (!place.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/destination/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

