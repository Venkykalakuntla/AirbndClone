const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./SchemaValidation");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in")
            return res.redirect("/user/login")
        }
        next();
}

//middleware for assigining redirectUrl to res.locals

module.exports.saveRedirectUrl=(req,res,next)=>{

    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
  next();
}

//middleware for owner authorization
module.exports.isOwner=async(req,res,next)=>{

    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
     next();
}

//middleware for review delete authorization
module.exports.isReviewAuthor=async(req,res,next)=>{

    let {id,reviewId}=req.params;
    // console.log(`Review ID: ${reviewId}`);
    const review=await Review.findById(reviewId);
    // console.log(review);
     if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You can't delete other's reviews");
        return res.redirect(`/listings/${id}`);
    }
     next();
}

//Schema Validation function -middleware for listings

module.exports.validateListing=(req,res,next)=>{
    let err=listingSchema.validate(req.body).error;
    if(err)
    {
    return next(new ExpressError(400,err));
    }
    next();
}


//schema validation middleware for reviews

module.exports.validateReview=(req,res,next)=>{
    let err=reviewSchema.validate(req.body).error;
    if(err)
    {
        // console.log(err.message);
      return  next(new ExpressError(400,err));
    }
     next();
}
