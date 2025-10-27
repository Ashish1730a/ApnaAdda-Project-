const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

// new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" }, // ✅ Nested populate for user details
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

// create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update route
// Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
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
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Delete!");
    res.redirect("/listings");
  })
);

module.exports = router;
