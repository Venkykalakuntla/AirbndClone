const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync");

const review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");



const reviewController = require("../controllers/review")


//add reviews
router.post("/", isLoggedIn, validateReview, WrapAsync(reviewController.addReview))



//delete reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, WrapAsync(reviewController.deleteReview))



module.exports = router;