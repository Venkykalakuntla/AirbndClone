const express=require("express");
const router=express.Router({mergeParams:true});
// const User=require("../models/user")
const passport=require("passport");
const WrapAsync = require("../utils/WrapAsync");
const{saveRedirectUrl}=require("../middleware");


const userController=require("../controllers/user")


// (signup form + signup user)
router
.route("/signup")
.get(userController.renderFormSignup)
.post(WrapAsync(userController.signupUser))


// // signup form
// router.get("/signup",userController.renderFormSignup)



// //signup user
// router.post("/signup",WrapAsync(userController.signupUser))


//(login form + login user)
router
.route("/login")
.get(userController.renderFormLogin)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/user/login",failureFlash:true})
,userController.loginUser)



// //login form
// router.get("/login",userController.renderFormLogin)



// //login authentication and post route
// //here passport.authenticate() is a middleware,authenticates the user 
// router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/user/login",failureFlash:true})
// ,userController.loginUser)



//logout user
router.get("/logout",userController.logoutUser)



module.exports=router;