import Bookmark from '../models/bookmark.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

// Add/Remove bookmark
export const toggleBookmark = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const existingBookmark = await Bookmark.findOne({ user: userId, post: postId });

        if (existingBookmark) {
            await existingBookmark.deleteOne();
            // Remove from user's bookmarks array
            await User.findByIdAndUpdate(
                userId,
                { $pull: { bookmarks: postId } }
            );
            res.json({ message: 'Bookmark removed', bookmarked: false });
        } else {
            const newBookmark = new Bookmark({
                user: userId,
                post: postId
            });
            await newBookmark.save();
            // Add to user's bookmarks array
            await User.findByIdAndUpdate(
                userId,
                { $push: { bookmarks: postId } }
            );
            res.json({ message: 'Post bookmarked', bookmarked: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's bookmarked posts
export const getBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user._id })
            .populate({
                path: 'post',
                populate: {
                    path: 'author',
                    select: 'username avatar'
                }
            })
            .sort({ createdAt: -1 });

        const posts = bookmarks.map(bookmark => bookmark.post);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if a post is bookmarked
export const checkBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOne({
            user: req.user._id,
            post: req.params.postId
        });
        res.json({ bookmarked: !!bookmark });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
