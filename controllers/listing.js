const Listing=require("../models/listing");
const {listingSchema,}=require("../schemavalidation");
const axios = require("axios");


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=async(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
      path:"reviews",
      populate:{
        path:"author",
      },
    }).populate("owner");
   
    res.render("listings/show.ejs",{listing});
}

module.exports.createNewListing=async(req,res,next)=>{
const location = req.body.listing.location; // e.g. "New Delhi"
    const geoResponse = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`,
      {
        params: {
          key: process.env.MAP_TOKEN
        }
      }
    );
 
    
  let url=req.file.path;
  let filename=req.file.filename;
 
  const newListing=new Listing(req.body.listing);
  newListing.owner=req.user._id;
   newListing.image={url,filename};
   newListing.geometry=geoResponse.data.features[0].geometry;
   let savedListing=await newListing.save();
   console.log(savedListing);
    req.flash("success","Listing saved successfully");
    res.redirect("/listings");
 
}

module.exports.EditRoute=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateRoute=async(req,res)=>{
   let {id}=req.params;
     
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();

   }
   req.flash("success","Listing updated successfully");
   res.redirect(`/listings/${id}`);
}

module.exports.DeleteRoute=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}