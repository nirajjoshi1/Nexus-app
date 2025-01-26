import { default as Reply } from '../models/reply.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

// Create a new reply
export const createReply = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const reply = new Reply({
            content,
            author: req.user._id,
            post: postId
        });
        await reply.save();
        
        // Add reply to user's replies array
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { replies: reply._id } },
            { new: true }
        );
        
        // Populate author details
        await reply.populate('author', 'username avatar');
        
        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get replies for a post
export const getReplies = async (req, res) => {
    try {
        const { postId } = req.params;
        const replies = await Reply.find({ post: postId })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(replies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a reply
export const deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        
        // Check if user is the author
        if (reply.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await reply.deleteOne();
        res.json({ message: 'Reply deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like/Unlike a reply
export const toggleLikeReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        const userIndex = reply.likes.indexOf(req.user._id);
        if (userIndex === -1) {
            reply.likes.push(req.user._id);
        } else {
            reply.likes.splice(userIndex, 1);
        }

        await reply.save();
        res.json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
