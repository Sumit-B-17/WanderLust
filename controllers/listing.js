const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) => {
    let lat, lon;
    try {
        let response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.listing.location}&apiKey=${process.env.GEOAPIFY_API_KEY}`);
        let data = await response.json();
        
        console.log("API Response:", data);
        
        if(!data.features || data.features.length === 0) {
            req.flash("error", "Invalid location! Please enter a valid address.");
            return res.redirect("/listings/new");
        }
        
        lon = data.features[0].geometry.coordinates[0];
        lat = data.features[0].geometry.coordinates[1];

        console.log(lat, lon);
    } catch (error) {
        console.error("Error fetching geocoding data:", error);
        req.flash("error", "There was an error processing your location. Please try again.");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = {
        type: "Point",
        coordinates: [lon, lat]
    };
    newListing.image = {url, filename};
    console.log("Saving listing with geometry:", newListing.geometry);
    console.log("Coordinates [lon, lat]:", [lon, lat]);
    await newListing.save();
    console.log("Saved listing:", newListing);
    // console.log(newListing);
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
};

module.exports.editForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    // Only transform Cloudinary URLs (they contain /upload/)
    if(originalImageUrl.includes("/upload/")) {
        originalImageUrl = originalImageUrl.replace("/upload/", "/upload/c_fill,w_250/");
    }
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
};

module.exports.listingData = async (req, res) => {
    const allListings = await Listing.find({});
    res.json(allListings);
};

// async (req, res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Successfully deleted listing!");
//     res.redirect("/listings");
// }