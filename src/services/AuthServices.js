import { User } from "../models/User.js";
import Email from "../utils/email.js";
import jwt from "jsonwebtoken";

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const register = async (req, res, next) => {
  try {
    console.log("Register function called with body:", req.body);
    const { username, email, password, phoneNo, confirmPassword } = req.body;
    if (!username || !email || !password || !phoneNo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    console.log("🏎️✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨");
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const avatarUrl = req.file ? req.file.path : null;
    console.log("Avatar URL:", avatarUrl);
    const user = await User.create({
      username,
      email,
      password,
      avatarUrl,
      phoneNo,
      confirmPassword,
    });

    if (user) {
      const loginLink = "http://localhost:5173/";
      console.log("🏎️✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨");
      const emailService = new Email();
      await emailService.SendMail(
        email,
        "Welcome to ZYNC",
        username,
        email,
        loginLink,
        avatarUrl,
      );
      return res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user,
      });
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    console.log("Login function called with body:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = createToken(user);

    const userData = user.toObject();
    delete userData.password;

    const cookieOptions = {
      httpOnly: true,
      samesite: "lax",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.samesite = "none";
      cookieOptions.secure = true;
    }

    res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      message: "User Logged In Successfully",
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while logging in user",
      error: error.message,
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in authentication",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({
      email,
    });
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in resetting password",
      error: error.message,
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting user",
      error: error.message,
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};
