const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");


router.all("/*",(req,res,next)=>{
        req.app.locals.layout = "admin";
        next();
   });

router.get("/delete/:id",(req,res)=>{

        Category.findById(req.params.id).then(Categories=>{

                Categories.remove().then(cat=>{
                        res.redirect("/admin/category");
                });

        });        

});

router.get("/edit/:id",(req,res)=>{

        Category.findById(req.params.id).then(Categories=>{

                res.render("admin/category/edit",{Categories:Categories});

        });        

});

router.post("/edit/:id",(req,res)=>{

        Category.findById(req.params.id).then(Categories=>{

                
                Categories.name = req.body.name;
              
                Categories.save().then(catSave=>{
                        res.redirect("/admin/category");
                }); 
        });        

});

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