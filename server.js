import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import http from "http";
import { Server } from "socket.io";
import {socketServer} from  './src/sockets/index.js'
import dns from "dns";


dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config({ quiet: true });

connectDB();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "https://zync-pi.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true,
  },
})


socketServer(io);



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
