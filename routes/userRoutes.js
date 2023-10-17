import express from "express";
import {
  followUser,
  getSingleUser,
  logOutUser,
  loginUser,
  signupUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import protectRoute from "../utils/protectRoute.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/follow/:id", protectRoute, followUser);
router.put("/update/:id", protectRoute, updateUser);
router.get("/profile/:username", getSingleUser);
router.delete("/delete/:id", protectRoute, deleteUser);

export default router;
