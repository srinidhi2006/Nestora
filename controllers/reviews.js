
const Listing=require("../models/listing");
const Review=require("../models/reviews");


module.exports.CreateReview=async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  req.flash("success","New Review created");
 res.redirect(`/listings/${listing._id}`);
}

module.exports.DeleteReview=async(req,res)=>{
  let{id,reviewId}=req.params;
  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review deleted successfully");
  res.redirect(`/listings/${id}`);
}

