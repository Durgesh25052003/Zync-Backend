import { User } from "../models/User.js";

export const getUserByName = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }
    const users = await User.find({ username: username });
    if (!res) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(users);
    res.status(200).json({
      success: true,
      message: "User found",
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {username} = req.body;
    const avatarUrl = req.file.path;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, avatarUrl},
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
