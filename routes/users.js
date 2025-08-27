const express=require("express");
const router=express.Router()
const User=require("../models/user");
const WrapAsync=require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware");
const UsersController=require("../controllers/users");
router.get("/signup",UsersController.SignupRender);


router.post("/signup",WrapAsync(UsersController.signup));
router.get("/login",UsersController.LoginRender);
router.post("/login",saveRedirectUrl,passport.authenticate("local",{ //here that middleware is used
    failureRedirect:'/login',
    failureFlash:true,
}),
UsersController.Login
);

router.get("/logout",UsersController.Logout);
module.exports=router;