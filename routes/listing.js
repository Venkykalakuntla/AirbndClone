const express=require("express");
const app=express();
const router=express.Router();
const WrapAsync=require("../utils/WrapAsync");
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
 

//new listing
router.get("/new",isLoggedIn, listingController.renderFormNewListing)



//(show listing + patch listing+ delete listing)
router
.route("/:id")
.get(WrapAsync (listingController.showListing))
.patch(isLoggedIn,isOwner,upload.single("image"),validateListing,WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,WrapAsync(listingController.deleteListing))



//edit listing
router.get("/edit/:id",isLoggedIn,isOwner,WrapAsync (listingController.renderFormEditListing))


//search listings
router.get("/search/:id",listingController.searchFilter)

router.post("/searchByPlace",listingController.searchByPlace)


module.exports=router;