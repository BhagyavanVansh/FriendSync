import React, { useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      setItem(KEY_ACCESS_TOKEN, data.result.accessToken);
      // console.log(data.result.accessToken);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
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
          Do you have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
