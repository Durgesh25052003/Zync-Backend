import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";


dotenv.config({ quiet: true });
const MONGO_URI = process.env.MONGO_URI;



const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await User.updateMany({}, { isOnline: false });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
