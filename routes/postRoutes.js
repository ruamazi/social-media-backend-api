import express from "express";
import protectRoute from "../utils/protectRoute.js";
import {
  createPost,
  deletePost,
  getSinglePost,
  updatePost,
  likePost,
  dislikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  deleteComment,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/get-post/:id", getSinglePost);
router.get("/user/:username", getUserPosts);
router.get("/feed", protectRoute, getFeedPosts);
router.post("/publish", protectRoute, createPost);
router.post("/update/:id", protectRoute, updatePost);
router.put("/like/:id", protectRoute, likePost);
router.put("/dislike/:id", protectRoute, dislikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.delete("/delete/:postId/:commentId", protectRoute, deleteComment);

export default router;
