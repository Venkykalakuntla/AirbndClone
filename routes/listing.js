const express=require("express");
const app=express();
const router=express.Router();
// const listing = require("../models/listing");
const WrapAsync=require("../utils/WrapAsync");
// const ExpressError=require("../utils/ExpressError");
// const {listingSchema,reviewSchema}=require("../SchemaValidation");
const {isLoggedIn,isOwner,validateListing}=require("../middleware");

const listingController=require("../controllers/listing");

const multer=require("multer")
const {storage}=require("../cloudConfig")

const upload=multer({storage})


//combining (all listings+ renderform new listing + add new Listing)
router
.route("/")
.get( WrapAsync(listingController.showAllListings))
.post(isLoggedIn,upload.single("image"),validateListing,WrapAsync(listingController.addNewListing));
 

// //all listings
// router.get("/",WrapAsync(listingController.showAllListings))


//new listing
router.get("/new",isLoggedIn, listingController.renderFormNewListing)


// //add new listing
// router.post("/",isLoggedIn,validateListing, WrapAsync(listingController.addNewListing));


//(show listing + patch listing+ delete listing)
router
.route("/:id")
.get(WrapAsync (listingController.showListing))
.patch(isLoggedIn,isOwner,upload.single("image"),validateListing,WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,WrapAsync(listingController.deleteListing))


// //show listing
// router.get("/:id",WrapAsync (listingController.showListing))


//edit listing
router.get("/edit/:id",isLoggedIn,isOwner,WrapAsync (listingController.renderFormEditListing))

router.get("/search/:id",listingController.searchFilter)

router.post("/searchByPlace",listingController.searchByPlace)


// //edit patch
// router.patch("/:id",isLoggedIn,isOwner,WrapAsync(listingController.updateListing))


// //delete listing
// router.delete("/:id",isLoggedIn,isOwner,WrapAsync(listingController.deleteListing))



module.exports=router;