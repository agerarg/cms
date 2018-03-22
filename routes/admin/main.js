const express = require("express");
const router = express.Router();


 router.all("/*",(req,res,next)=>{
     req.app.locals.layout = "admin";
     next();
});


router.get("/",(req,res)=>{
    res.render("admin/index");
});
router.get("/posts",(req,res)=>{
    res.send("post list");
});
router.get("/posts/create",(req,res)=>{
    res.send("post create");
});


module.exports = router;