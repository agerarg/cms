const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({

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

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

}, {usePushEach:true});

module.exports = mongoose.model("posts",PostSchema);