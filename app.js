const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressFileUpload = require("express-fileupload");
//dbconection
mongoose.connect("mongodb://localhost:27017/cms").then(db=>{
    console.log("conectado a la base de datos (cmd)");
}).catch(err=> console.log(err));

//Setup static dir
app.use(express.static(path.join(__dirname, 'public')));

//Setup layout
const {select} = require("./helpers/helperino");
app.set('view engine','handlebars');
app.engine("handlebars",exphbs({defaultLayout: 'home',helpers:{select:select}}));

//Method Override
app.use(methodOverride("_method"));

//Body Parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Upload middleware
app.use(expressFileUpload());

//Routes
const home = require("./routes/home/main");
const admin = require("./routes/admin/main");

// User Routes
app.use("/", home);
app.use("/admin", admin);


app.listen(9300,()=>{
    console.log("listenint 9300");
});