const Destination=require('../models/destination');
const Review = require('../models/review');

module.exports.createReview=async(req,res)=>{
    const place=await Destination.findById(req.params.id);
       const review=new Review(req.body.review);
       review.author = req.user._id;

   place.reviews.push(review);;
   await review.save();
   await place.save();
   req.flash('success', 'successfully created a new review')

   res.redirect(`/destination/${place._id}`);

}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Destination.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted review')

    res.redirect(`/destination/${id}`);
}