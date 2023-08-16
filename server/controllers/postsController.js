const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/utils");
const cloudnary = require("cloudinary").v2;

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;
    const owner = req._id;

    if (!caption || !postImg) {
      return res.send(error(400, "caption and post image are required."));
    }

    const cloudImg = await cloudnary.uploader.upload(postImg, {
      folder: "postImg",
    });

    const user = await User.findById(req._id);

    const post = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.secure_url,
      },
    });

    user.posts.push(post._id);
    await user.save();

    return res.send(success(200, { post }));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentId = req._id;

    const post = await Post.findById(postId).populate("owner");
    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.likes.includes(currentId)) {
      const index = post.likes.indexOf(currentId);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currentId);
    }

    await post.save();
    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (err) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const currentUserId = req._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currentUserId) {
      return res.send(error(403, "Only owner can update their post"));
    }

    if (caption) {
      post.caption = caption;
    }

    await post.save();

    return res.send(success(200, { post }));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentUserId = req._id;

    const post = await Post.findById(postId);
    const currentUser = await User.findById(currentUserId);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.owner.toString() !== currentUserId) {
      return res.send(error(403, "Only owner can delete their post"));
    }

    const index = currentUser.posts.indexOf(postId);
    currentUser.posts.splice(index, 1);
    await currentUser.save();

    await Post.deleteOne({ _id: postId });
    res.send(success(200, "Post deleted successfully."));
  } catch (err) {
    // console.log(err);
    res.send(error(500, err.message));
  }
};

module.exports = {
  createPostController,
  likeAndUnlikePost,
  updatePostController,
  deletePostController,
};
