import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isDM: {
    type: Boolean,
    default: false,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  roomImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dx9kqv1u8/image/upload/v1700000000/default_room_image.png",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastMessage:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
});

RoomSchema.pre("save", async function (next) {
  try {
    if (!this.isDM) {
      return;
    }
    const friendPFP = await mongoose
      .model("User")
      .findById(this.members[1])
      .select("avatarUrl");
    this.roomImage = friendPFP.avatarUrl;
  } catch (error) {
    next(error);
  }
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
