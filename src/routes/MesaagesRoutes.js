import express from "express";
import { getMessage, sendMessage } from "../controllers/MessageController.js";
import { protectUser } from "../controllers/AuthController.js";
import upload from "../utils/multer.js";

const MessageRouter = express.Router();

MessageRouter.get("/getMessages/:roomId", protectUser, getMessage);
MessageRouter.post("/sendMessage/:roomId", protectUser, upload.single("image"),sendMessage);

export default MessageRouter;
