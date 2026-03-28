import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  getMe,
  logoutUser,
  protectUser,
} from "../controllers/AuthController.js";
import upload from "../utils/multer.js";
import { getUserUsingName, updateMe } from "../controllers/UserController.js";

const UserRouter = express.Router();

UserRouter.post(
  "/register",
  upload.single("avatarUrl"),
  (req, res, next) => {
    console.log("MULTER PASSED");
    next();
  },
  registerUser,
);
UserRouter.post("/login", loginUser);
UserRouter.post("/reset-password", forgotPassword);
UserRouter.get("/me", protectUser, getMe);
UserRouter.post("/logout", protectUser, logoutUser);
UserRouter.get("/getUserByName/:username", protectUser, getUserUsingName)
UserRouter.patch("/updateMe", protectUser, upload.single("avatarUrl"),updateMe);
export default UserRouter;
