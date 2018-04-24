const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");




router.get("/",(req,res)=>{

        Category.find({}).then(Categories=>{

                res.render("admin/category/index",{Categories:Categories});

        });        

});

router.post("/create",(req,res)=>{

        const newCategory = Category({
                name : req.body.name,
        });

        newCategory.save().then(newCategory=>{
                res.redirect("/admin/category");   
        });
    

});

module.exports = router;