const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

router.all("/*",(req,res,next)=>{
        req.app.locals.layout = "admin";
        next();
   });

router.get("/",(req,res)=>{

        Comment.find({}).populate('user').then(coments=>{

                res.render("admin/comments",{coments:coments});

        })

});
router.get("/delete/:id",(req,res)=>{

        Comment.findByIdAndRemove(req.params.id).then(coments=>{

                Post.findOneAndUpdate({comments: req.params.id},{$pull:{comments: req.params.id}},(err,data)=>{
                        if(err) return err;
                        res.redirect(`/admin/comment`);
                });
        });
});

router.post("/post",(req,res)=>{

        Post.findOne({_id:req.body.id}).then(post=>{

                const newComment = new Comment({

                        user: req.user.id,
                        body: req.body.body

                }) ;

                post.comments.push(newComment);
                post.save().then(savedPost=>{
                       newComment.save().then(savedComment=>{
                                res.redirect(`/post/${req.body.id}`);
                        });
                        
                });
        });

});

router.post("/approve",(req,res)=>{

       Comment.findByIdAndUpdate(req.body.id,{$set: {approve: req.body.approve}},(err,result)=>{
               if(err) return err;
               res.send(result);
       });

});

module.exports = router;