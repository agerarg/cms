const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressFileUpload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//dbconection
mongoose.connect("mongodb://localhost:27017/cms").then(db=>{
    console.log("conectado a la base de datos (cmd)");
}).catch(err=> console.log(err));

//Setup static dir
app.use(express.static(path.join(__dirname, 'public')));

//Setup layout
const {select,generateTime} = require("./helpers/helperino");
app.set('view engine','handlebars');
app.engine("handlebars",exphbs({defaultLayout: 'home',helpers:{select:select,generateTime:generateTime}}));

//Method Override
app.use(methodOverride("_method"));

//Body Parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Upload middleware
app.use(expressFileUpload());

app.use(session({
    secret: "asdasd",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
// PASSPORTS
app.use(passport.initialize());
app.use(passport.session());

// handle var variable

app.use((req,res,next)=>{
    res.locals.user = req.user || false;
    res.locals.succsess_msg = req.flash("succsess_msg");
    res.locals.delete_msg = req.flash("delete_msg");
    res.locals.update_msg = req.flash("update_msg");
    res.locals.error = req.flash("error");
    next();
});

//Routes
const home = require("./routes/home/main");
const admin = require("./routes/admin/main");
const category = require("./routes/admin/category");
const comment = require("./routes/admin/comment");
// User Routes
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/category",category);
app.use("/admin/comment",comment);
app.listen(9300,()=>{
    console.log("listenint 9300");
});