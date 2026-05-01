import express from 'express';
import Thread from '../models/Thread.js';
import Message from '../models/Message.js';

const ShareRouter = express.Router();

// @desc    View shared chat
// @route   GET /share/:threadId
// @access  Public
ShareRouter.get('/:threadId', async (req, res, next) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404);
            throw new Error("Thread not found");
        }

        if (!thread.isPublic) {
            res.status(403);
            throw new Error("This chat is not public");
        }

        const messages = await Message.find({ threadId }).sort({ createdAt: 1 });

        res.json({
            title: thread.title,
            messages
        });
    } catch (error) {
        next(error);
    }
});

export default ShareRouter;
