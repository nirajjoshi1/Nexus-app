import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  bookmarkPost,
  commentOnPost,
  createPost,
  deletePost,
  getFollowingPosts,
  getAllPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
  repostPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/bookmark/:id", protectRoute, bookmarkPost);
router.post("/repost/:id", protectRoute, repostPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
