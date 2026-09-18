const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();
    // Use an atomic update so legacy listings with incomplete geometry can
    // still receive reviews without revalidating every listing field.
    await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview._id } });

    req.flash("success", "Successfully added review");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Successfully deleted review");
    res.redirect(`/listings/${id}`);
};
