const mongoose=require("mongoose");
const initData=require("./data");

const Listing=require('../models/listing');

const MONGO_URL='mongodb://127.0.0.1:27017/Nestora';

 
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6884afc920009d4dec9602bc"}));
    await Listing.insertMany(initData.data);

    console.log("Data is initialized");
}
initDB();