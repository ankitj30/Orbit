import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;
