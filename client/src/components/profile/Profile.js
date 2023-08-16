import React, { useEffect, useState } from "react";
import "./profile.scss";
import Post from "../post/Post";
import user from "../../assests/avatar.png";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const feedData = useSelector((state) => state.feedReducer.feedData);
  const userProfile = useSelector((state) => state.postsReducer.userProfile);
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const dispatch = useDispatch();

  const handleUserFollow = () => {
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: params.userId,
      })
    );
  };

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );

    setIsMyProfile(myProfile._id === params.userId);
    setIsFollowing(
      feedData?.followings?.find((item) => item._id === params.userId)
    );
  }, [myProfile, params.userId, feedData]);

  return (
    <div className="profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((post) => {
            return <Post post={post} key={post._id} />;
          })}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="user-img"
              src={userProfile?.avatar?.url}
              alt="user"
            />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p className="bio"> {userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Following`}</h4>
            </div>

            {!isMyProfile && (
              <button
                onClick={handleUserFollow}
                className={`follow-btn ${
                  isFollowing ? "btn-secondary" : "btn-primary"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            {isMyProfile && (
              <button
                className="update-btn btn-secondary"
                onClick={() => navigate("/updateProfile")}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
