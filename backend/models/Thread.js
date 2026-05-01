import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Optimize query speed for recent updates
ThreadSchema.index({ updatedAt: -1 });

const Thread = mongoose.model('Thread', ThreadSchema);

export default Thread;