import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const socketAuth = async (socket, next) => {
  console.log("Auth middleware running");
  try {
    const token = socket.handshake.headers.cookie;
    if (!token) {
      return next(new Error("Authentication Error"));
    }

    const tokenValue = token.split("token=")[1]?.split(";")[0]; // ← safer parsing
    if (!tokenValue) return next(new Error("Token not found"));

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new Error("User not found"));

    socket.user = user;
    next();
  } catch (error) {
    console.log("Socket auth error:", error.message); // ← log the real error
    return next(new Error("Authentication Error"));
  }
};
