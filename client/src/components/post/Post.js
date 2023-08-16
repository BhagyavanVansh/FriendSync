import React from "react";
import "./post.scss";
import Avatar from "../avatar/Avatar";
import postImg from "../../assests/nature.jpg";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePostLike = async () => {
    dispatch(
      likeAndUnlikePost({
        postId: post?._id,
      })
    );

    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: post?.isliked ? "Unliked" : "Liked",
      })
    );
  };

  return (
    <div className="post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post.owner._id}`)}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{post?.owner?.name}</h4>
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="post" />
      </div>
      <div className="footer">
        <div className="like" onClick={handlePostLike}>
          {post.isliked ? (
            <AiFillHeart style={{ color: "red" }} className="icon" />
          ) : (
            <AiOutlineHeart className="icon" />
          )}

          <h4>{`${post?.likesCount} likes`}</h4>
        </div>
        <p className="caption">{post?.caption}</p>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>
    </div>
  );
};

export default Post;
