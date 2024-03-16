const Review = require("../models/reviewModel");

exports.createReview = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;
    const { rating, reviewText, createdAt } = req.body;

    const existingReview = await Review.findOne({ doctorId, patientId });

    if (existingReview) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Patient has already reviewed this doctor",
        });
    }

    // Create the review object
    const review = await Review.create({
      doctorId,
      patientId,
      rating,
      reviewText,
      createdAt,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = req.body;

    // Find the review by ID and update it
    const review = await Review.findByIdAndUpdate(reviewId, updatedReview, {
      new: true,
    });

    // Check if review exists
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
