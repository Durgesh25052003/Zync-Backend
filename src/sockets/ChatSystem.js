import Message from "../models/Messages.js";
import Room from "../../src/models/Room.js";
import { callSocket } from "./CallSocket.js";

export const chatSocket = async (io, socket) => {
  try {
    //get roomId from socket
    socket.on("join-room", async (roomId) => {
      const room = await Room.findOne({
        _id: roomId,
        members: socket.user._id,
      });
      if (!room) {
        return socket.emit("error", "Not allowed in this room");
      }
     socket.join(roomId); 
      console.log(`User ${socket.user._id} joined room ${roomId}`);
    });
  } catch (error) {
    console.log("Error while joining the room..");
  }

  socket.on("start-typing", (roomId) => {
    console.log("start-typing received on backend", roomId);
    socket.to(roomId).emit("start-typing", {
      userId: socket.user._id,
    });
  });
  socket.on("stop-typing", (roomId) => {
    socket.to(roomId).emit("stop-typing", {
      userId: socket.user._id,
    });
  });
  

  socket.on("send-message", async ({ roomId, content }) => {
    try {
      const message = await Message.create({
        sender: socket.user._id,
        content,
        room: roomId,
        image:null
      });
      console.log(message);
      await message.populate("sender", "_id username avatarUrl");
      await Room.findByIdAndUpdate(roomId, {
        latestMessage: message._id,
      });
      socket.to(roomId).emit("receive-message", message);
    } catch (error) {
      console.log("Failed to recieve Message...");
    }
  });
};
