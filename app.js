if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}




const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const dbUrl=process.env.ATLAS_URL;
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,

});
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});
const sessionOptions={
  store,
    secret:process.env.SECRET,
    resave:false,
    saveUnitialized:true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};


//const MONGO_URL='mongodb://127.0.0.1:27017/Nestora';


const path=require("path");
const WrapAsync=require("./utils/WrapAsync");
const ExpressError=require("./utils/ExpressError");

const listingsrouter=require("./routes/listings");

const {listingSchema,reviewSchema}=require("./schemavalidation");
const Review=require("./models/reviews");
const reviewsrouter=require("./routes/reviews");
const userrouter=require("./routes/users");

 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.urlencoded({extended:true}));
 app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 app.use(express.static(path.join(__dirname,"/public")));
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
}
app.get("/",(req,res)=>{
    res.render("./home.ejs");
});


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*async function updateImageField() {
  try {
    const listingId = "68565ce06210b9bbbdb8e4fd"; // your target _id

    const result = await Listing.findByIdAndUpdate(
      listingId,
      {
        image: {
          filename: "listingimage",
          url: "https://images.unsplash.com/photo-1606050716461-78add0ad1785?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      },
      { new: true } // returns the updated document
    );

    console.log("Updated document:", result);
  } catch (err) {
    console.error("Error updating image field:", err);
  }
}

updateImageField();*/
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
   
    next();
})
app.get("/demouser",async(req,res)=>{
  const fakeUser=new User({
    email:"fakeuser@gmail.com",
    username:"student@926",
  });
  const registered=await User.register(fakeUser,"helloworld"); //register is built in package to store user and password
  res.send(registered);
})
app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",userrouter);



app.use((err,req,res,next)=>{
  let{statusCode=500,message="Somethin went wrong!"}=err;
 res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log("server listening at port 8080");
});
