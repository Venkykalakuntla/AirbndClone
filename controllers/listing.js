const listing=require("../models/listing");

//allListings
module.exports.showAllListings= async (req, res,next) => {
    let allListings = await listing.find();
    res.render("index.ejs", { allListings });
}


//renderform for new listing
module.exports.renderFormNewListing=(req, res) => {

    //the below method is converted to middleware
    // if(!req.isAuthenticated())
    // {
    //     req.flash("error","You must be logged in")
    //     res.redirect("/user/login")
    // }
    // else
    res.render("newListing.ejs");
}


//adding new listing
module.exports.addNewListing=async (req, res,next) => {
    let data = req.body;
    let url=req.file.path;
    let fileName=req.file.filename;
    //if there is no data and we are checking for the whole listing object
    // if(!data.listing)
    // {
    //      throw new ExpressError(400,"Enter Valid Listing Data");
    // }

    //valdating each field using Joi

    // let result=listingSchema.validate(data);
    // console.log(result);
    // if(result.err)
    // {
    //     throw new ExpressError(400,result.err);
    // }

    const newListing =  new listing(data);

    //adding current user id to owner int listing;
    newListing.owner=req.user._id;
    newListing.image={url,fileName};

    // console.log(url," -- ",fileName);

     await newListing.save();
    //  console.log("data is",insertData);
    req.flash("success","New Listing Created");
    
    res.redirect("/listings");
}



//show listing details
module.exports.showListing=async (req, res,next) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list)
    {
        
        req.flash("error","Listing you are looking for is delete");
        res.redirect("/listings")
    }
    // console.log(list);
      res.render("show.ejs", { list:list ,mapToken:process.env.MAP_API_TOKEN});
}



//render form for editing listing
module.exports.renderFormEditListing=async (req, res,next) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    if(!list)
        {
            req.flash("error","Listing you are looking for is delete");
            res.redirect("/listings")
        }
    let originalUrl=list.image.url;
     originalUrl=originalUrl.replace("/upload","/upload/w_250")
    res.render("edit.ejs",{list,originalUrl})
}


// update listing
module.exports.updateListing=async(req,res,next)=>{
    let { id } = req.params;
    const list = await listing.findByIdAndUpdate(id,req.body,{ runValidators: true }, { new: true });
    if(!list)
        {
            req.flash("error","Listing you are looking for is delete");
            res.redirect("/listings")
        }
    if(typeof req.file !== "undefined")
    {
      let url=req.file.path;
      let fileName=req.file.filename;
      list.image={url,fileName}
      await list.save();
    }
    // console.log(list);
    req.flash("success","Listing Edited Successfully");

    res.redirect(`/listings/${id}`);
}


//delete listing
module.exports.deleteListing=async(req,res,next)=>{
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    // console.log(deletedList);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}

module.exports.searchFilter=async(req,res)=>{

    let { id } = req.params;
    let allListings = await listing.find({type:id});
    res.render("index.ejs", { allListings });
    
}

module.exports.searchByPlace=async(req,res)=>{

     
    let place = req.body.place;
    if(place.length<=0)
        return res.redirect("/listings");
    let allListings = await listing.find({country:place});
    res.render("index.ejs", { allListings });
    
}