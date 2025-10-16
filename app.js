// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Import the Listing model
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const Reviews = require("./models/review.js");
const listings = require("./routes/listing.js")

// Connect to MongoDB database
main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => console.log(err));

// Async function to handle database connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});



const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

app.use("/listing", listings)

// Reviews
// Post Route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

// Route to test inserting a sample listing into the database
// app.get("/testListing", async(req,res) => {
//     // Create a new Listing document
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "A beautiful villa located in the heart of the city.",
//         price: 250000,
//         location: "Greater Noida",
//         country: "India",
//     });
//     // Save the document to MongoDB
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("success testing");
// })

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong !" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// Start the Express server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
