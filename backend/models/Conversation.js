import mongoose from "mongoose";

const conversationSchema= new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})

const conversation = mongoose.model('Conversation', conversationSchema);

export default conversation;