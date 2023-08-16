const Post = require("../models/Post");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/utils");
const cloudinary = require("cloudinary").v2;

const followOrUnfollowUserController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;

    const currentUserId = req._id;

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (currentUserId === userIdToFollow) {
      return res.send(error(409, "Users not follow our self."));
    }
    if (!userToFollow) {
      return res.send(error(404, "User to follow not found."));
    }

    if (currentUser.followings.includes(userIdToFollow)) {
      const followingIndex = currentUser.followings.indexOf(userIdToFollow);
      currentUser.followings.splice(followingIndex, 1);

      const followerIndex = userToFollow.followers.indexOf(currentUserId);
      userToFollow.followers.splice(followerIndex, 1);
    } else {
      currentUser.followings.push(userIdToFollow);
      userToFollow.followers.push(currentUserId);
    }

    await userToFollow.save();
    await currentUser.save();

    return res.send(success(200, { user: userToFollow }));
  } catch (err) {
    console.log(err);
    return res.send(error(500, err.messsage));
  }
};

const getPostsOfFollowing = async (req, res) => {
  try {
    const currentUserId = req._id;

    const currentUser = await User.findById(currentUserId).populate(
      "followings"
    );

    const fullposts = await Post.find({
      owner: {
        $in: currentUser.followings,
      },
    }).populate("owner");

    const posts = fullposts
      .map((item) => {
        return mapPostOutput(item, req._id);
      })
      .reverse();

    const followingsIds = currentUser.followings.map((item) => item._id);
    followingsIds.push(req._id);
    const suggestions = await User.find({
      _id: {
        $nin: followingsIds,
      },
    });

    return res.send(success(200, { ...currentUser._doc, suggestions, posts }));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};

const getMyPosts = async (req, res) => {
  try {
    const currentUserId = req._id;

    const allUserPosts = await Post.find({
      owner: currentUserId,
    }).populate("likes");

    return res.send(success(200, { allUserPosts }));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.send(error(400, "UserId is required."));
    }

    const allUserPosts = await Post.find({
      owner: userId,
    }).populate("likes");

    return res.send(success(200, { allUserPosts }));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const currentUserId = req._id;
    const currentUser = await User.findById(currentUserId);

    // delete all post.

    await Post.deleteMany({
      owner: currentUserId,
    });

    // remove myself from followers following.
    currentUser.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);
      const index = follower.followings.indexOf(currentUserId);
      follower.followings.splice(index, 1);
      await follower.save();
    });

    console.log("nice 1st");
    //remove myself from my following followers.
    currentUser.followings.forEach(async (followingId) => {
      const following = await User.findById(followingId);
      const index = following.followers.indexOf(currentUserId);
      following.followers.splice(index, 1);
      await following.save();
    });
    console.log("nice 2nd");

    //remove myself from all likes.
    const allPosts = await Post.find();
    allPosts.forEach(async (post) => {
      const index = post.likes.indexOf(currentUserId);
      post.likes.splice(index, 1);
      await post.save();
    });

    await User.deleteOne({ _id: currentUserId });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "User deleted successfully"));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    return res.send(success(200, { user }));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};

const upadateUserProfile = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;

    const user = await User.findById(req._id);
    if (name) {
      user.name = name;
    }

    if (bio) {
      user.bio = bio;
    }

    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }

    await user.save();
    return res.send(success(200, { user }));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });

    const fullPosts = user.posts;

    const posts = fullPosts
      .map((item) => {
        return mapPostOutput(item, req._id);
      })
      .reverse();
    return res.send(success(200, { ...user._doc, posts }));
  } catch (err) {
    return res.send(error(500, err.messsage));
  }
};
module.exports = {
  followOrUnfollowUserController,
  getPostsOfFollowing,
  getMyPosts,
  getUserPosts,
  deleteMyProfile,
  getMyInfo,
  upadateUserProfile,
  getUserProfile,
};
