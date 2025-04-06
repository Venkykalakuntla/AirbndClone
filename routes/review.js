const express=require("express");
const router=express.Router({mergeParams:true});
// const listing = require("../models/listing");
const WrapAsync=require("../utils/WrapAsync");
// const ExpressError=require("../utils/ExpressError");
// const {listingSchema,reviewSchema}=require("../SchemaValidation");

const review=require("../models/review");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware");



const reviewController=require("../controllers/review")



//add reviews
router.post("/",isLoggedIn,validateReview,WrapAsync(reviewController.addReview))



//delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewController.deleteReview))



module.exports=router;