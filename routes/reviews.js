const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync=require("../utils/WrapAsync");
const {listingSchema,reviewSchema}=require("../schemavalidation");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const Review=require("../models/reviews");
const{isLoggedIn,isReviewAuthor}=require("../middleware");
const validateReview=(req,res,next)=>{
  let {error}= reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};

const reviewController=require("../controllers/reviews");

router.post("/",isLoggedIn,validateReview,WrapAsync(reviewController.CreateReview));
router.delete("/:reviewId",isLoggedIn,WrapAsync(reviewController.DeleteReview));
module.exports=router;