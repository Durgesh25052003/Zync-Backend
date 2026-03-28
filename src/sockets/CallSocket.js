import { onlineUsers } from "./index.js";

const normalizeId = (id) => (id ? id.toString() : "");

const emitToUser = (to, io, event, data) => {
  const sockets = onlineUsers.get(normalizeId(to));
  sockets?.forEach((socketId) => io.to(socketId).emit(event, data));
};

export const callSocket = (io, socket) => {
  try {
    socket.on("call:initiate", async ({ to, roomId, callType }) => {
      console.log("call:initiate received", to, roomId, callType);
      emitToUser(to, io, "call:incoming", {
        from: normalizeId(socket.user._id),
        roomId,
        callType,
        callerName: socket.user.username,
        callerAvatar: socket.user.avatarUrl,
      });
    });

    socket.on("call:accept", ({ to, roomId }) => {
      console.log("call:accept received", to, roomId);
      emitToUser(to, io, "call:accepted", {
        from: normalizeId(socket.user._id),
        roomId,
      });
    });

    socket.on("call:offer", ({ to, offer }) => {
      console.log("call:offer received", to);
      emitToUser(to, io, "call:offer", {
        from: normalizeId(socket.user._id),
        offer,
      });
    });

    socket.on("call:answer", ({ to, answer }) => {
      console.log("call:answer received", to);
      emitToUser(to, io, "call:answer", {
        from: normalizeId(socket.user._id),
        answer,
      });
    });

    socket.on("call:ice", ({ to, candidate }) => {
      emitToUser(to, io, "call:ice", {
        from: normalizeId(socket.user._id),
        candidate,
      });
    });

    socket.on("call:reject", ({ to, roomId }) => {
      console.log("call:rejected received", to, roomId);
      emitToUser(to, io, "call:rejected", {
        from: normalizeId(socket.user._id),
        roomId,
      });
    });

    socket.on("call:end", ({ to, roomId }) => {
      emitToUser(to, io, "call:ended", {
        from: normalizeId(socket.user._id),
        roomId,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};