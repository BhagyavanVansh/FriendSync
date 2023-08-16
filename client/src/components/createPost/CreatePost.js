import React, { useState } from "react";
import "./createPost.scss";
import Avatar from "../avatar/Avatar";
import bgImage from "../../assests/nature.jpg";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";

const CreatePost = () => {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();

  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  };

  const handlePostSubmit = async () => {
    try {
      await axiosClient.post("/posts", {
        caption,
        postImg,
      });
      // console.log(result);
      dispatch(
        getUserProfile({
          userId: myProfile?._id,
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setCaption("");
      setPostImg("");
    }
  };

  return (
    <div className="createPost">
      <div className="left-part">
        <Avatar className="user-avatar" src={myProfile?.avatar?.url} />
      </div>
      <div className="right-part">
        <input
          value={caption}
          type="text"
          className="captionInput"
          placeholder="What's on your mind?"
          onChange={(e) => setCaption(e.target.value)}
        />
        {postImg && (
          <div className="img-container">
            <img src={postImg} alt="post" className="post-img" />
          </div>
        )}
        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              type="file"
              id="inputImg"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
