const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage: storage });

const listingController = require('../controllers/listing.js');

router.get("/data", wrapAsync(listingController.listingData));

router.route("/")
    .get( wrapAsync(listingController.index))
    .post( isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.newForm);

router.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( isOwner, isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete( isOwner, isLoggedIn, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.editForm));

module.exports = router; 