import express from 'express';
import { createReply, getReplies, deleteReply, toggleLikeReply } from '../controllers/reply.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Create a new reply
router.post('/post/:postId', proteccreattRoute, createReply);

// Get replies for a post
router.get('/post/:postId', getReplies);

// Delete a reply
router.delete('/:replyId', protectRoute, deleteReply);

// Like/Unlike a reply
router.post('/:replyId/like', protectRoute, toggleLikeReply);

export default router;
