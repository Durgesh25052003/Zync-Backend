import { io } from "../../server.js";
import redis from "../config/redis.js";
import Message from "../models/Messages.js";
import Room from "../models/Room.js";

export const sendMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const image = req.file.path;
    console.log(roomId);
    console.log(content, "content");
    //Is that room exists or not
    const isRoomExists = await Room.findOne({ _id: roomId });
    console.log(isRoomExists);
    const members = isRoomExists.members;
    if (!isRoomExists) {
      return res.status(404).json({ message: "Room not found" });
    }
    console.log(isRoomExists);
    //Does a recipient is part of the room or not
    if (
      !isRoomExists.members.some((memberId) => memberId.equals(req.user._id))
    ) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }
    const sender = req.user._id;

    const chatKey = members.sort().join("_");
    const cachedKey = `chat-${chatKey}:messages`;
    // Invalidate the cache for the room's messages
    await redis.del(cachedKey);
    //Persist the message in database
    const message = await Message.create({
      room: roomId,
      sender,
      content,
      image,
    });
    await message.populate("sender", "_id username avatarUrl isOnline");
    await Room.findByIdAndUpdate(roomId, { latestMessage: message._id });
    console.log(message);
    // broadcast to all sockets in room, including sender
    io.to(roomId).emit("receive-message", message);
    res.status(200).json({ data: message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    console.log(roomId);
    const room = await Room.findOne({ _id: roomId });
    const members = room.members;
    //redis implementation
    // const chatKey = members.sort().join("_");
    // const cachedKey = `chat-${chatKey}:messages`;
    // const cachedMessages = await redis.get(cachedKey);
    // console.log(JSON.parse(cachedMessages));
    // if (cachedMessages) {
    //   console.log("Messages fetched from cache ✅✅");
    //   return res.status(200).json(JSON.parse(cachedMessages));
    // }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    //Logic to get messages for the roomId
    console.log("messages fetched from database ✅");
    const messages = await Message.find({ room })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "_id username avatarUrl isOnline ");

    // Store messages in Redis cache with an expiration time of 1 hour
    // await redis.setEx(cachedKey, 60, JSON.stringify({
    //   messages,
    //   page,
    //   limit,
    //   totalMessages: messages.length,
    // }));

    res
      .status(200)
      .json({ messages, page, limit, totalMessages: messages.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get messages", error: error.message });
  }
};
