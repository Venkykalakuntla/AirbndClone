const mongoose=require("mongoose");
const review=require("./review.js")
const listingSchema=new mongoose.Schema({
    title:
    {
        type:String,
        required:true

    },
    description:
    {
        type:String,
        required:true
    },
    image:
    {
        url:String,
        fileName:String
    },
    price:
    {
        type:Number,
        required:true
    },
    location:
    {
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type:
    {
    type:String,
    
    }
})

//mongoose post middle ware for deleting reviews in review model when a listing is deleted

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        // console.log(listing);
      let res=await review.deleteMany({_id:{$in:listing.reviews}})
    
    }
  })

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;