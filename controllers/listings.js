const Listing = require("../models/listing");

//index route
module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

//New route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// show route
module.exports.showListing = async (req, res) => {
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
};

//create route
module.exports.createListing = async (req, res, next) => {
  console.log(req.body); 
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

//Edit route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

//   Update route
module.exports.updateListing = async (req, res) => {
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
};

//Delete route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Listing Delete!");
  res.redirect("/listings");
};
