import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import genTokenSetCookie from "../utils/genTokenSetCookie.js";
import { v2 as cloudinary } from "cloudinary";

export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
      return res.status(404).json({ error: "All feilds are required" });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    if (newUser) {
      genTokenSetCookie(newUser._id, res);
      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
      await newUser.save();
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPassCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPassCorrect) {
      return res.status(400).json({ error: "Invalid username or password!" });
    }
    genTokenSetCookie(user._id, res);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser", error.message);
  }
};

export const logOutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logging out function", error.message);
  }
};
export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can not follow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found!" });
    }
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //unfollowing user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      return res.status(200).json({ message: "User has been unfollowed" });
    } else {
      //following user
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      return res.status(200).json({ message: "User has been followed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in follow user function", error.message);
  }
};

export const updateUser = async (req, res) => {
  const { username, email, name, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You can update only your profile" });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (profilePic && profilePic !== user.profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResp = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResp.secure_url;
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user = await user.save();
    const userNoPassword = await User.findById(user._id).select("-password");
    return res.status(200).json(userNoPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in update user function", error.message);
  }
};

export const getSingleUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in get single user function", error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("User not found!");
    }
    if (id !== userId.toString()) {
      return res.status(400).json("You can delete only your account!");
    }
    await User.deleteOne(userId);
    return res.status(200).json("User has been deleted!");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in delete user function", error.message);
  }
};
