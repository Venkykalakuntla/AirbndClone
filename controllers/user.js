const User=require("../models/user")


//render form for signup
module.exports.renderFormSignup=(req,res)=>{
    // console.log("signup");
    res.render("users/signup.ejs")
}


//signup user
module.exports.signupUser=async(req,res)=>{

    try{
    let {username,email,password}=req.body;

    const newUser=new User({email,username});

    let registeredUser=await User.register(newUser,password);
    // console.log(result);

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Registered Successfully")
        res.redirect("/listings");
    })
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }
    
}


//render form for login
module.exports.renderFormLogin=(req,res)=>{
    // console.log("signup");
    res.render("users/login.ejs")
}


//login user
module.exports.loginUser=async(req,res)=>{

    req.flash("success","Loging successful");
    let redirectUrl=res.locals.redirectUrl;
    if(redirectUrl)
        res.redirect(redirectUrl);
    else
    res.redirect("/listings");
}


//logout user
module.exports.logoutUser=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out successfully!")
        res.redirect("/listings")
    })
}