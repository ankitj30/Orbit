import express from 'express';
import Thread from '../models/Thread.js';
import Message from '../models/Message.js';
import fetchGeminiResponse from '../utils/gemini.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const ChatRouter = express.Router();

// @desc    Send message and get AI response
// @route   POST /chat
// @access  Private
ChatRouter.post('/', authenticateUser, async (req, res, next) => {
    try {
        const { threadId, message } = req.body;

        if (!threadId || !message) {
            return res.status(400).json({ error: "Thread ID and message are required" });
        }

        // Verify Thread Ownership
        const existingThread = await Thread.findOne({ threadId });

        if (existingThread) {
            if (existingThread.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ error: "Not authorized for this thread" });
            }
        } else {
            return res.status(404).json({ error: "Thread not found" });
        }

        // 1. Save User Message
        const userMsg = await Message.create({
            threadId,
            role: 'user',
            content: message
        });

        // 2. Fetch AI Response from Gemini
        let aiResponseText;
        try {
            aiResponseText = await fetchGeminiResponse(message);
        } catch (geminiError) {
            return res.status(500).json({
                error: "Gemini API Failed",
                details: geminiError.message
            });
        }

        // 3. Save AI Message
        const aiMsg = await Message.create({
            threadId,
            role: 'assistant',
            content: aiResponseText
        });

        // 4. Update Thread Meta (Last updated, title generation)
        const thread = await Thread.findOne({ threadId });
        if (thread) {
            thread.updatedAt = Date.now();

            // Auto-generate title for new chats
            const msgCount = await Message.countDocuments({ threadId });
            if (msgCount <= 2 && thread.title === "New Chat") {
                const words = message.split(' ');
                const newTitle = words.slice(0, 6).join(' ');
                thread.title = newTitle + (words.length > 6 ? "..." : "");
            }
            await thread.save();
        }

        res.json({
            reply: aiResponseText,
            userMessage: userMsg,
            aiMessage: aiMsg
        });

    } catch (error) {
        next(error);
    }
});

export default ChatRouter;
