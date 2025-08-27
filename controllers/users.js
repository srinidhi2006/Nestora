const User=require("../models/user");
const WrapAsync=require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware");

module.exports.SignupRender=(req,res)=>{
    res.render("../views/users/signup");
}

module.exports.signup=async(req,res)=>{
    try{
         let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
          req.flash("success","Welcome to Nestora");
    res.redirect("/listings");
    });
   
}catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   

}

module.exports.LoginRender=(req,res)=>{
    res.render("../views/users/login");
}

module.exports.Login=async(req,res)=>{
    req.flash("success","Welcome to Nestora! You are logged in");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}

module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","You are successfully logged out");
      res.redirect("/listings");
    })
}