import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({

  image:{
    type: String,
    default: null,
  },
  content: {
    type: String,
    required:function(){
      return !this.image;
    },
    trim: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
