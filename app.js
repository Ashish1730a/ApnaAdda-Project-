// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Import the Listing model
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const session = require("express-session")
const flash = require("connect-flash")

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

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
  
}

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)



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
