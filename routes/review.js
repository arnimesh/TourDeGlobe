const express=require('express');
const router=express.Router();

const catchAsync=require('../utils/catchAsync');
const expressError=require('../utils/expressError');
const Destination=require('../models/destination');
const {reviewSchema}=require('../schemas.js');
const Review = require('../models/review');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews');


   
router.post('/:id/reviews',isLoggedIn,validateReview, catchAsync(reviews.createReview));

router.delete('/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports=router;