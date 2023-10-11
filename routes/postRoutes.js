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
} from "../controllers/postController.js";

const router = express.Router();

router.post("/publish", protectRoute, createPost);
router.post("/update/:id", protectRoute, updatePost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/get-post/:id", getSinglePost);
router.get("/feed", protectRoute, getFeedPosts);
router.post("/like/:id", protectRoute, likePost);
router.post("/dislike/:id", protectRoute, dislikePost);
router.post("/reply/:id", protectRoute, replyToPost);

export default router;
