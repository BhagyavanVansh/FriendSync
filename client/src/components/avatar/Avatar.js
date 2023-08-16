import React from "react";
import "./avatar.scss";
import user from "../../assests/avatar.png";

const Avatar = ({ src }) => {
  return (
    <div className="avatar">
      <img src={src ? src : user} alt="user" />
    </div>
  );
};

export default Avatar;
