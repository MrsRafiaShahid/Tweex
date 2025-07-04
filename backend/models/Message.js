import mongoose from "mongoose";
import conversation from "./Conversation";

const messageSchema = new mongoose.Schema({
    conversationID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message;