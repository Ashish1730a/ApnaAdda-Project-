const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

// new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});


// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created!")
    res.redirect("listings");
  })
);

// Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Update route
// Update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    // Normal fields update
    let updatedData = req.body.listing;

    // Agar user ne image URL diya hai to usse object banake save karo
    if (updatedData.image) {
      updatedData.image = {
        filename: "listingimage",
        url: updatedData.image,
      };
    }

    await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true });

    res.redirect(`/listings/${id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports= router;