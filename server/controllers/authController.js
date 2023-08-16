const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!name || !email || !password) {
      // return res.status(400).send("All fields are required!");
      return res.send(error(400, "All fields are required."));
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.send(error(409, "User is already registered."));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      bio,
      avatar,
    });

    await user.save();

    // return res.status(201).json({
    //   user,
    // });

    return res.send(success(201, "User created successfully."));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All fields are required!");
      return res.send(error(400, "All fields are required!"));
    }

    const oldUser = await User.findOne({ email }).select("+password");

    if (!oldUser) {
      // return res.status(404).send("User is not registered.");
      return res.send(error(404, "User is not registered."));
    }

    const matched = await bcrypt.compare(password, oldUser.password);
    if (!matched) {
      // return res.status(403).send("Incorrect password.");
      return res.send(error(403, "Incorrect password."));
    }

    const accessToken = generateAccessToken({
      _id: oldUser._id,
    });
    const refreshToken = generateRefreshToken({
      _id: oldUser._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.json({ accessToken });

    return res.send(
      success(200, {
        accessToken,
      })
    );
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "User logged out"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

//this api will check the refreshToken validity and generate new access Token.
const refreshAccessTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies.jwt) {
      // return res.status(401).send("Refresh token in cookie is required");
      return res.send(error(401, "Refresh token in cookie is required"));
    }

    const refreshToken = cookies.jwt;

    // console.log(refreshToken);

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    // return res.status(201).json({ accessToken });

    return res.send(
      success(201, {
        accessToken,
      })
    );
  } catch (err) {
    console.log(err);
    // return res.status(401).send("Invalid refresh key");
    return res.send(error(401, "Invalid refresh key"));
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (err) {
    console.log(err);
    return res.send(error(401, "Invalid refresh key"));
  }
};
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    // console.log(token);
    return token;
  } catch (err) {
    console.log(err);
    return res.send(error(401, "Invalid refresh key"));
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
