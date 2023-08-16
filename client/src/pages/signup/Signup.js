import React, { useState } from "react";
import "./signup.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { showToast } from "../../redux/slices/appConfigSlice";
import { useDispatch } from "react-redux";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });

      if (response.status === "ok") {
        dispatch(
          showToast({
            type: TOAST_SUCCESS,
            message: response.result,
          })
        );
        navigate("/login");
      }

      if (response.status === "error") {
        dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: response.message,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup">
      <div className="signup-box">
        <h2 className="heading">Signup</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="name"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" className="submit" onClick={handleSubmit} />
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
