import express from "express";
import {
  createRoom,
  createDMRoom,
  getAllRooms,
  updateGC,
  getRoom,
} from "../controllers/RoomController.js";
import { protectUser } from "../controllers/AuthController.js";
import upload from "../utils/multer.js";
const RoomRouter = express.Router();

RoomRouter.post("/createRoom", protectUser, createRoom);
RoomRouter.post("/createDMRoom", protectUser, createDMRoom);
RoomRouter.get("/getRooms", protectUser, getAllRooms);
RoomRouter.patch(
  "/updateRoom/:roomId",
  protectUser,
  upload.single("roomImage"),
  updateGC,
);
RoomRouter.get("/getRoom/:roomId", protectUser, getRoom);

export default RoomRouter;
