import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true,
        enum:['like','comment','follow', 'repost','commentLike']
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    read:{
        type: Boolean,
        default: false
    }
},{timestamps:true});

export default mongoose.model('Notification', notificationSchema);