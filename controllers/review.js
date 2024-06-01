//---------------- Review Routes -----------------
const Hotel = require("../models/hotel.js"); // Require Hotel model
const Review = require("../models/review.js"); // Require Review model

// Create route

module.exports.createReview = async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findById(id).populate("reviews");

    if (!hotel) {
      req.flash("error", "Hotel not found");
      return res.redirect(`/explore/${id}`);
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    hotel.reviews.push(newReview);
    await hotel.save();

    let ratingSum = 0;
    for (let review of hotel.reviews) {
      ratingSum += review.rating;
    }
    hotel.ratingAvg = ratingSum / hotel.reviews.length;
    await hotel.save();

    req.flash("success", "New review created");
    res.redirect(`/explore/${hotel._id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred");
    let id = req.params.id;
    res.redirect(`/explore/${id}`);
  }
};

// Delete route

module.exports.deleteReview = async (req, res) => {
  try {
    let { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    const hotel = await Hotel.findById(id).populate("reviews");

    if (hotel.reviews.length === 0) {
      hotel.ratingAvg = 0;
      await hotel.save();
    } else {
      let ratingSum = 0;
      for (let review of hotel.reviews) {
        ratingSum += review.rating;
      }
      hotel.ratingAvg = ratingSum / hotel.reviews.length;
      await hotel.save();
    }

    req.flash("success", "Review deleted successfully");
    res.redirect(`/explore/${id}`);
  } catch {
    let { status = 500 } = err;
    res.status(status).render("user/went-wrong.ejs");
  }
};
