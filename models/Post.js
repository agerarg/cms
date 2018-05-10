const mongoose = require("mongoose");
const URLSlug = require("mongoose-url-slugs");
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    user :{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "categorys"
    },
    
    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "public"
    },
   
    body:{
        type: String,
        required: true
    },
    file:{
        type:String
    },
    date:{
        type:Date,
        default: Date.now()
    },
    slug: {
        type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

}, {usePushEach:true});

PostSchema.plugin(URLSlug('title',{field: 'slug'}));

module.exports = mongoose.model("posts",PostSchema);