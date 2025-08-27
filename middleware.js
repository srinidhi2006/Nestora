
const Listing=require("./models/listing");
const Review=require("./models/reviews");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl; //this will save the original url which was tried to access before logging in
    req.flash("error","You must be logged in ");
    return res.redirect("/login");

  }
  next();
   
}
module.exports.saveRedirectUrl=(req,res,next)=>{ //since passport changes the session after login url is saved in local to redirect to after logging in
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner=async(req,res,next)=>{
  let{id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of the listing");
   return res.redirect(`/listings/${id}`);
  
  }
   next();
};
module.exports.isReviewAuthor=async(req,res,next)=>{
  let{id,reviewId}=req.params;
  let review=await Review.findById(id);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
   return res.redirect(`/listings/${id}`);
  
  }
   next();
};