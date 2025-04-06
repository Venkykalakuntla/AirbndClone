const listing = require("../models/listing");

//allListings
module.exports.showAllListings = async (req, res, next) => {
    let allListings = await listing.find();
    res.render("index.ejs", { allListings });
}


//renderform for new listing
module.exports.renderFormNewListing = (req, res) => {
    res.render("newListing.ejs");
}


//adding new listing
module.exports.addNewListing = async (req, res, next) => {
    let data = req.body;
    let url = req.file.path;
    let fileName = req.file.filename;
    const newListing = new listing(data);
    newListing.owner = req.user._id;
    newListing.image = { url, fileName };
    await newListing.save();
    req.flash("success", "New Listing Created");

    res.redirect("/listings");
}



//show listing details
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!list) {

        req.flash("error", "Listing you are looking for is delete");
        res.redirect("/listings")
    }
    // console.log(list);
    res.render("show.ejs", { list: list, mapToken: process.env.MAP_API_TOKEN });
}



//render form for editing listing
module.exports.renderFormEditListing = async (req, res, next) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "Listing you are looking for is delete");
        res.redirect("/listings")
    }
    let originalUrl = list.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250")
    res.render("edit.ejs", { list, originalUrl })
}


// update listing
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    const list = await listing.findByIdAndUpdate(id, req.body, { runValidators: true }, { new: true });
    if (!list) {
        req.flash("error", "Listing you are looking for is delete");
        res.redirect("/listings")
    }
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let fileName = req.file.filename;
        list.image = { url, fileName }
        await list.save();
    }
    // console.log(list);
    req.flash("success", "Listing Edited Successfully");

    res.redirect(`/listings/${id}`);
}


//delete listing
module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    // console.log(deletedList);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}

//search listing by filter
module.exports.searchFilter = async (req, res) => {

    let { id } = req.params;
    let allListings = await listing.find({ type: id });
    res.render("index.ejs", { allListings });

}


//search listing by place
module.exports.searchByPlace = async (req, res) => {


    let place = req.body.place;
    if (place.length <= 0)
        return res.redirect("/listings");
    let allListings = await listing.find({ country: place });
    res.render("index.ejs", { allListings });

}