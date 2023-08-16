import React, { useState } from "react";
import "./navbar.scss";
import Avatar from "../avatar/Avatar";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
      dispatch(setLoading(false));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h2 className="banner hover-link" onClick={() => navigate("/")}>
          FriendSync
        </h2>
        <div className="right">
          <div
            className="hover-link"
            onClick={() => navigate(`/profile/${myProfile._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="hover-link logout">
            <TbLogout onClick={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
