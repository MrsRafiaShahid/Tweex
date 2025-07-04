import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim:true,
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
        replies:[{
            username: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            comment: {
                type: String,
                required: true,
                trim:true,
        
            },
            likes:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const Comment = mongoose.model("Comment", commentsSchema);

export default Comment;