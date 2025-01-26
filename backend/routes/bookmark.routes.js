import express from 'express';
import { toggleBookmark, getBookmarks, checkBookmark } from '../controllers/bookmark.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Toggle bookmark status
router.post('/:postId', protectRoute, toggleBookmark);

// Get user's bookmarked posts
router.get('/', protectRoute, getBookmarks);

// Check if a post is bookmarked
router.get('/:postId/check', protectRoute, checkBookmark);

export default router;
