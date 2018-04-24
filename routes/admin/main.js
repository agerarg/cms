const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const faker = require("faker");
const {isEmpty, uploadDir} = require("../../helpers/upload-helper");
const fs = require("fs");
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
            post.file = "basic.jpg";
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
        if(!isEmpty(req.files))
        {
        let file = req.files.file;
        let  filename = Date.now() + '-' +file.name;
        post.file = filename;

            file.mv("./public/upload/"+ filename,(err)=>{
                if(err) throw err;
                
            });
        }
        post.save().then(savedPost=>{
            req.flash('update_msg', `Post Actualizado: ${post.title}`);
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

    Post.findOne({_id:req.params.id}).then(post=>{

        //res.send("deleting:"+uploadDir+post.file);
        if (fs.existsSync(uploadDir+post.file)) {
            fs.unlink(uploadDir+post.file,err=>{ });
        }
        post.remove().then(err=>{});
        req.flash('delete_msg', `Post deletiado: ${post.title}`);
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
    let errors = [];


    if(!req.body.titulo){
        errors.push({mensaje: 'Pone un titulo!'})
    }

    if(errors.length > 0){
        res.render("admin/posts_crear",{errors:errors});
    }
    else
    {
        let filename="basic.jpg";
        if(!isEmpty(req.files))
        {
        let file = req.files.file;
            filename = Date.now() + '-' +file.name;

            file.mv("./public/upload/"+ filename,(err)=>{
                if(err) throw err;
                
            });
        }
        const newPost = new Post({
            title: req.body.titulo,
            status: req.body.estatus,
            body: req.body.body,
            file: filename
        });

        newPost.save().then(savedPost=>{
           req.flash('succsess_msg', `Post creado: ${savedPost.title}`);
            res.redirect("/admin/posts");
        }).catch(err=>{
            res.send(err);
        });
    }
});

module.exports = router;