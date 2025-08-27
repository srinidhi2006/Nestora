const express=require("express");
const router=express.Router();


router.get("/",(req,res)=>{
    res.send("Get request for users");
});
router.get("/:id",(req,res)=>{
    res.send("Get request for particular user");
});
router.post("/",(req,res)=>{
    res.send("Post request for users");
});
router.delete("/:id",(req,res)=>{
    res.send("Delete request for users");
});
module.exports=router;