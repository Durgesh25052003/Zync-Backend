import Room from "../models/Room.js";
import { User } from "../models/User.js";
import { callSocket } from "./CallSocket.js";
import { chatSocket } from "./ChatSystem.js";
import { socketAuth } from "./SocketAuth.js";

export const onlineUsers = new Map();

export const socketServer = (io) => {
  io.use(socketAuth);

  io.on("connection", async (socket) => { 
    const userId = socket.user._id.toString();
    await User.findByIdAndUpdate(userId, { isOnline: true });
    
    console.log("user connected", socket.id, userId);

    // create set if first socket
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    // add this socket
    onlineUsers.get(userId).add(socket.id);

    // send online users list
    socket.emit("online-users", Array.from(onlineUsers.keys()));

    // notify others
    socket.broadcast.emit("user_online", { userId });

    // AUTO JOIN ROOMS
    const rooms = await Room.find({
      members: socket.user._id,
    });

    rooms.forEach((room) => {
      socket.join(room._id.toString());
      console.log(`Joined room: ${room._id}`);
    });

    chatSocket(io, socket);
    callSocket(io, socket);


    socket.on("disconnect", async () => {
      const userSockets = onlineUsers.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        // user offline only if no sockets left
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          await User.findByIdAndUpdate(userId, { isOnline: false });
          socket.broadcast.emit("user_offline", { userId });
        }
      }

      console.log("user disconnected", socket.id);
    });
  });
};
