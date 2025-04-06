const listing = require("../models/listing");
const review=require("../models/review");



//add new review
module.exports.addReview=async(req,res,next)=>{

    let {id}=req.params;
    let list=await listing.findById(id);
    let newReview= new review(req.body);

    newReview.author=req.user._id;
    
    list.reviews.push(newReview)
   
     await newReview.save();
 
     await list.save();
     req.flash("success","New Review Added Successfully");

    res.redirect(`/listings/${list.id}`);

}



//delete review
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
     await review.findByIdAndDelete(reviewId);
     await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     req.flash("success","Review Deleted Successfully");

     res.redirect(`/listings/${id}`)
}