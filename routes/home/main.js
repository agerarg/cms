const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
router.all("/*",(req,res,next)=>{
    req.app.locals.layout = "home";
    next();
});


router.get("/",(req,res)=>{
    Post.find({}).then(posts=>{
        Category.find({}).then(categories=>{
            res.render("home/index",{posts:posts,categories:categories}); 
        });
    });
   
});
router.get("/about",(req,res)=>{
    res.render("home/about");
});
router.get("/login",(req,res)=>{
    res.render("home/login");
});
//APP LOGIN

passport.use(new LocalStrategy({ usernameField: 'email'}, (email,password,done)=>{
    
    User.findOne({email: email}).then(user=>{
        if(!user) return done(null,false,{message: 'No existe el usuario'});


        bcrypt.compare(password,user.password,(err,matched)=>{
            if(err) return err;
            if(matched)
            {
                return done(null,user);
            }
            else
            {
                return done(null,false,{message: 'Password is incorrect'});
            }
        });

    });
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}));

router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/login");
});


router.post("/login",(req,res,next)=>{
   
    passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);


});
router.get("/register",(req,res)=>{
    res.render("home/register");
});
router.post("/register",(req,res)=>{

    let errors = [];

    if(req.body.password!==req.body.passwordConfirm){
        errors.push({mensaje: 'El Password no es el mismo!'})
    }
    

    if(errors.length > 0){
        res.render("home/register",{errors:errors});
    }
    else
    {
        User.findOne({email:req.body.email}).then(user=>{
        if(!user)
        {
            const newUser = new User({
                firtsName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email,
                password : req.body.password
            });

            bcrypt.genSalt(10,(err,salt)=>{

                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    newUser.password = hash;

                    newUser.save().then(newUsr=>{
                        res.redirect("/login");
                    })

                });
            });
        }
        else
        {
            errors.push({mensaje: 'El mail ya esta en uso!'});
            res.render("home/register",{errors:errors});
        }   
    });
    }
    
});

router.get("/post/:id",(req,res)=>{

    Post.findOne({slug:req.params.id})
    .populate({path:'comments',match:{approve: true}, populate:{path:'user', model:'users'}})
    .populate("user")
    .then(post=>{

        res.render("home/post",{post:post});


    })
});

module.exports = router;