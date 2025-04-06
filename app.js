require('dotenv').config();
 
const express = require("express");
const mongoose = require("mongoose");
const app = express();
 const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");

let dbUrl=process.env.ATLASDB_URL;


const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRETE
      },
      touchAfter:24*3600
  })

  store.on("error",(err)=>{
    console.log("Error in mongo session store:",err)
  })

const sessionOptions={
    store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+1000*60*60*24*15,
        maxAge:1000*60*60*24*15,
        httpOnly:true,
    }
   };


// express router routes
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const passport = require("passport");



 
app.set("view engine",'ejs');
app.set("views", path.join(__dirname, "views"));
app.engine("ejs",ejsMate);
 
 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride ('_method'));

//session and flash middlewares
app.use(session(sessionOptions));
app.use(flash());

// passport-authenuication middlewares
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 


let port =  process.env.PORT || 8080;
 

app.listen(port, () => {
    console.log("app is listening at port:", port);
})

 

main()
    .then((res) => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dbUrl);
}


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


//home default
app.get("/",(req,res)=>{
    res.redirect("/listings")
})


// express router  middlewares
app.use("/listings",listingRouter)
app.use("/listings/:id/review",reviewRouter)
app.use("/user",userRouter)



//middlewares for error handling

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

// our custom error handler middleware

app.use((err,req,res,next)=>{
 
    let {status=500,message="something went wrong"}=err;
       res.render("error.ejs",{status,message});
 })