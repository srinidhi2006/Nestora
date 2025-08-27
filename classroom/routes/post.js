const express=require("express");
const  router=express.Router();


router.get("/",(req,res)=>{
    res.send("get request for posts");
});
router.get("/:id",(req,res)=>{
    res.send("Get request for particular post");
});
router.post("/",(req,res)=>{
    res.send("Post request for posts");
});
router.delete("/:id",(req,res)=>{
    res.send("Delete request for posts");
});
module.exports=router;