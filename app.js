import express from "express";
import UserRouter from "./src/routes/UserRoutes.js";
import RoomRouter from "./src/routes/RoomRoutes.js";
import cookieParser from "cookie-parser";
import MessageRouter from "./src/routes/MesaagesRoutes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://zync-pi.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/room", RoomRouter);
app.use("/api/v1/message", MessageRouter);

export default app;
