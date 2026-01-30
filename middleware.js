const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const express = require('express');
const router = express.Router({ mergeParams: true });

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }  
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }   
    next();
}

module.exports.validateListing = (req, res, next) => {
    // Normalize empty image fields so Joi validation and DB defaults behave correctly
    if (req.body && req.body.listing) {
        // If image was submitted as a simple empty string (old form) -> remove it
        if (typeof req.body.listing.image === 'string' && req.body.listing.image.trim() === '') {
            delete req.body.listing.image;
        }
        // If image was submitted as { url: '' } (new form) -> remove it
        if (req.body.listing.image && typeof req.body.listing.image.url === 'string' && req.body.listing.image.url.trim() === '') {
            delete req.body.listing.image;
        }
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(el => el.message).join(","), 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);  
    if(error) {
        throw new ExpressError(error.details.map(el => el.message).join(","), 400);
    } else {
        next();
    }   
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }       
    next();
};