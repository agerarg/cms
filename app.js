const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
//dbconection
mongoose.connect("mongodb://localhost:27017/cms").then(db=>{
    console.log("conectado a la base de datos (cmd)");
}).catch(err=> console.log(err));

//Setup static dir
app.use(express.static(path.join(__dirname, 'public')));

//Setup layout
app.engine("handlebars",exphbs({defaultLayout: 'home'}));
app.set('view engine','handlebars');

//Routes
const home = require("./routes/home/main");
const admin = require("./routes/admin/main");

// User Routes
app.use("/", home);
app.use("/admin", admin);


app.listen(9300,()=>{
    console.log("listenint 9300");
});