const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");

 router.all("/*",(req,res,next)=>{
     req.app.locals.layout = "admin";
     next();
});


router.get("/",(req,res)=>{
    res.render("admin/index");
});
router.get("/posts",(req,res)=>{
    res.render("admin/posts");
});

router.get("/posts/create",(req,res)=>{
    res.render("admin/posts_crear");
});
router.post("/posts/create",(req,res)=>{

   const newPost = new Post({
        title: req.body.titulo,
        status: req.body.estatus,
        body: req.body.body
    });

    newPost.save().then(savedPost=>{
        console.log(savedPost);
        res.redirect("/admin/posts")
    }).catch(err=>{
        res.send(err);
    });
  //  console.log(req.body);

});

module.exports = router;