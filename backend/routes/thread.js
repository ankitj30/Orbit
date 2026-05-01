import express from 'express';
import Thread from '../models/Thread.js';
import Message from '../models/Message.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const ThreadRouter = express.Router();

// @desc    Start a new conversation thread
// @route   POST /threads
// @access  Private
ThreadRouter.post('/', authenticateUser, async (req, res, next) => {
    try {
        const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const thread = await Thread.create({
            threadId,
            user: req.user._id,
            title: "New Chat",
        });

        res.status(201).json(thread);
    } catch (error) {
        next(error);
    }
});

// @desc    Get all user threads
// @route   GET /threads
// @access  Private
ThreadRouter.get('/', authenticateUser, async (req, res, next) => {
    try {
        const threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (error) {
        next(error);
    }
});

// @desc    Get thread details & messages
// @route   GET /threads/:threadId
// @access  Private
ThreadRouter.get('/:threadId', authenticateUser, async (req, res, next) => {
    try {
        const thread = await Thread.findOne({ threadId: req.params.threadId });
        if (!thread) {
            res.status(404);
            throw new Error("Thread not found");
        }

        if (thread.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("Not authorized to view this thread");
        }

        const messages = await Message.find({ threadId: req.params.threadId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a thread
// @route   DELETE /threads/:threadId
// @access  Private
ThreadRouter.delete('/:threadId', authenticateUser, async (req, res, next) => {
    try {
        const { threadId } = req.params;

        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            res.status(404);
            throw new Error("Thread not found");
        }

        if (thread.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("Not authorized to delete this thread");
        }

        await Thread.findOneAndDelete({ threadId });
        await Message.deleteMany({ threadId });

        res.json({ message: 'Thread deleted' });
    } catch (error) {
        next(error);
    }
});

// @desc    Generate public share link
// @route   POST /threads/:threadId/share
// @access  Private
ThreadRouter.post('/:threadId/share', authenticateUser, async (req, res, next) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404);
            throw new Error("Thread not found");
        }

        if (thread.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("Not authorized to share this thread");
        }

        thread.isPublic = true;
        await thread.save();

        // Construct share URL
        const shareUrl = `${req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${threadId}`;

        res.json({ shareUrl });
    } catch (error) {
        next(error);
    }
});

export default ThreadRouter;
