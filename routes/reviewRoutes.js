const express = require("express");
const reviewController = require("../controllers/reviewController")
const router = express.Router();

router.post('/:doctorId/:patientId', reviewController.createReview);

router.get('/:doctorId', reviewController.getDoctorReviews);

router.put('/:reviewId', reviewController.updateReview);

router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;