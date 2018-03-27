const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const faker = require("faker");

 router.all("/*",(req,res,next)=>{
     req.app.locals.layout = "admin";
     next();
});

//Insert data
router.post("/inserterino",(req,res)=>{

        for(let i=0;i<req.body.cant; i++)
        {
            let post = new Post();
            post.title = faker.name.title();
            post.status = "public";
            post.body = faker.lorem.sentence();
            post.save().then(savedPost=>{});
        }
        res.redirect("/admin/posts");    

});



router.get("/",(req,res)=>{
    res.render("admin/index");
});

router.put("/edit/:id",(req,res)=>{
  
    var id = req.params.id;
    Post.findById(id).then(post=>{

        post.title = req.body.titulo;
        post.status = req.body.estatus;
        post.body = req.body.body;

        post.save().then(savedPost=>{
            res.redirect("/admin/posts");
        });
    });
});



router.get("/edit/:id",(req,res)=>{
    var id = req.params.id;
        Post.findById(id).then(post=>{
            res.render("admin/posts_editar",{post:post});
        });

});
/////
router.delete("/posts/:id",(req,res)=>{

    Post.remove({_id:req.params.id}).then(removed=>{
          res.redirect("/admin/posts");
    });

});

router.get("/posts",(req,res)=>{

    Post.find({}).then(posts=>{
        res.render("admin/posts",{posts:posts});
    });

});

router.get("/posts/create",(req,res)=>{
    res.render("admin/posts_crear");
});

router.post("/posts/create",(req,res)=>{


    let file = req.files.file;
    let filename = file.name;

    file.mv("./public/upload/"+ filename,(err)=>{
        if(err) throw err;
        
    });

//    const newPost = new Post({
//         title: req.body.titulo,
//         status: req.body.estatus,
//         body: req.body.body
//     });

//     newPost.save().then(savedPost=>{
//         console.log(savedPost);
//         res.redirect("/admin/posts")
//     }).catch(err=>{
//         res.send(err);
//     });
  //  console.log(req.body);

});

module.exports = router;