import mongoose from "mongoose";

const storySchema=new mongoose.Schema({

      user:{
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
           required: true
       },
       title: {
        type: String,
        required: true
       },
       comment: {
        type: String,
        required: true,
        trim:true,

    },
    image: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Story=mongoose.model("Story", storySchema);

export default Story;