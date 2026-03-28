import io from "socket.io-client";
import Room from "../models/Room.js";

const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTdlMjVjNTQxNzk1YWMxMzZmNGJhYSIsImlhdCI6MTc3MzgwNzc5OCwiZXhwIjoxNzc0NDEyNTk4fQ.T2TgA2W0Ol5Ua-Rf8qEkmpBMmnwxCH0q7t1f0Nilq4E",
  },
});

socket.on("connect", async () => {
  console.log("Connected:", socket.id);

  // Wait slightly for the server to process the join (DB lookup) before sending
  setTimeout(() => {
    socket.emit("receive-message", {
      roomId: "69b3f82a0d30ff442c93dbf2",
      content: "Hello",
    });
  }, 500);

  socket.on("receive-message", (data) => {
    console.log(data);
  });

  socket.on("error", (err) => {
    console.error("Socket Error:", err);
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
