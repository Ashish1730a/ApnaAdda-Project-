const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")


const Listing = require("../models/listing.js"); // ✅ Import Listing
const Reviews = require("../models/review.js");   // ✅ Import Review



// Reviews
// Post Route
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!")

    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;