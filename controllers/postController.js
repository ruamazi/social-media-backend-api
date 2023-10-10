import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  const { text, postedBy, img } = req.body;
  try {
    if (!text || !postedBy) {
      return res.status(400).json("Post content is required");
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json("Please login to be able to post");
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json("You can publish a post only from your account!");
    }
    const maxLength = 500;
    if (text.legth > maxLength) {
      return res.status(400).json(`Text must be less than${maxLength}`);
    }
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    return res.status(201).json({ message: "Post has been created.", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in create post function", error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in update post function", error.message);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json("Unauthorized to delete this post!");
    }
    await Post.findByIdAndDelete(id);
    return res.status(200).json("Post has been deleted.");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in delete post function", error.message);
  }
};

export const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in get post function", error.message);
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }
    const likedPost = post.likes.includes(userId);
    const dislikedPost = post.dislikes.includes(userId);
    if (likedPost) {
      //removing like from post
      await Post.updateOne(
        { _id: id },
        {
          $pull: { likes: userId },
        }
      );
      return res.status(200).json("Your like is removed from the post.");
    } else if (dislikedPost) {
      // Removing dislike from post
      await Post.updateOne(
        { _id: id },
        {
          $pull: { dislikes: userId },
          $push: { likes: userId },
        }
      );
      return res.status(200).json("Your dislike is removed and like added.");
    } else {
      //adding like to the post
      post.likes.push(userId);
      await post.save();
      return res.status(200).json("Your like is added to the post.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in like post function", error.message);
  }
};

export const dislikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }
    const dislikedPost = post.dislikes.includes(userId);
    const likedPost = post.likes.includes(userId);
    if (dislikedPost) {
      //removing dislike from post
      await Post.updateOne(
        { _id: id },
        {
          $pull: { dislikes: userId },
        }
      );
      return res.status(200).json("Your dislike is removed from the post.");
    } else if (likedPost) {
      await Post.updateOne(
        { _id: id },
        {
          $pull: { likes: userId },
          $push: { dislikes: userId },
        }
      );
      return res.status(200).json("Your like is removed and a dislike added.");
    } else {
      //adding like to the post
      post.dislikes.push(userId);
      await post.save();
      return res.status(200).json("Your dislike is added to the post.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in like post function", error.message);
  }
};