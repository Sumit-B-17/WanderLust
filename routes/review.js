const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');
const review = require('../models/review.js');

const reviewController = require('../controllers/review.js');

//Review
//POST review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;