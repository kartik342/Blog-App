 const mongoose = require('mongoose');

 const postSchema = mongoose.Schema({

    // user who created the post
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user" // reference to user
    },
    date : {
        type : Date,            
        default : Date.now,
    },
    content : String,
    likes :[ //array of userId who like the post
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user", // reference to user
        }
    ]
 })

module.exports = mongoose.model('post', postSchema);