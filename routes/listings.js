const express=require("express");
const router=express.Router()
const WrapAsync=require("../utils/WrapAsync");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const {listingSchema,}=require("../schemavalidation");
const { isLoggedIn,isOwner}=require("../middleware");
const multer  = require('multer');
const{storage}=require("../cloudConfig");
const upload = multer({ storage })
const validateListing=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};
const listingController=require("../controllers/listing");
//Home Route
router.get("/",listingController.index);
//New Form
router.get("/new",isLoggedIn,listingController.renderNewForm);
//Show route
router.get("/:id",listingController.showListing);
//Create Route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,WrapAsync(listingController.createNewListing));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.EditRoute);
//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),listingController.updateRoute);
//Delete Route
router.delete("/:id",isLoggedIn,isOwner,WrapAsync(listingController.DeleteRoute));

module.exports=router;