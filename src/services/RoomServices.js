import mongoose from "mongoose";
import Room from "../models/Room.js";

//Room Feature
export const createRoomGC = async (req, res) => {
  try {
    const { roomName, members } = req.body;
    console.log(roomName, members);
    const membersNew = [...members, req.user._id];
    if (!roomName || !members || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Room name and at least 2 members are required",
      });
    }
    const isRoomExists = await Room.findOne({
      name: roomName,
    });
    if (isRoomExists) {
      return res.status(400).json({
        success: false,
        message: "Room with this name already exists",
      });
    }

    const memberObjectIds = membersNew.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const room = new Room({
      name: roomName,
      members: memberObjectIds,
      createdBy: req.user._id,
    });
    await room.save();
    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating room",
      error: error.message,
    });
  }
};

//DM Feature

export const DMRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to create DM Room",
      });
    }
    const roomName = `DM-${req.user._id}-${userId}`;
    console.log("Creating DM Room with name:", roomName);
    console.log(typeof roomName);
    const userObjectId = new mongoose.Types.ObjectId(req.body.userId);

    const room = new Room({
      name: roomName,
      isDM: true,
      members: [req.user._id, userObjectId],
      createdBy: req.user._id,
    });
    await room.save();
    res.status(201).json({
      success: true,
      message: "DM Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating DM Room",
      error: error.message,
    });
  }
};

//Get Rooms for a user

export const getRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Room.find({ members: userId })
      .populate("members", "_id username email avatarUrl isOnline") // added isOnline
      .populate(
        "lastMessage", // added this
        "content createdAt",
      );
    const roomsMod = rooms.map((room) => {
      if (room.isDM) {
        const otherUser = room.members.find(
          (member) => member._id.toString() !== userId.toString(), // cleaner find
        );

        return {
          roomId: room._id,
          isDM: true,
          currentUserId: userId.toString(),
          otherUserId: otherUser._id,
          roomName: otherUser.username, // was otherUser.name → username
          roomAvatar: otherUser.avatarUrl,
          roomMembers: room.members,
          isOnline: otherUser.isOnline ?? false, // added
          lastMessage: room.lastMessage?.content ?? null, // added
          lastMessageTime: room.lastMessage?.createdAt ?? room.createdAt, // added
        };
      }

      return {
        roomId: room._id,
        isDM: false,
        roomName: room.name,
        currentUserId: userId.toString(),
        roomAvatar: room.roomImage,
        roomMembers: room.members,
        lastMessage: room.lastMessage?.content ?? null, // added
        lastMessageTime: room.lastMessage?.createdAt ?? room.createdAt, // added
      };
    });
    res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      roomsMod,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching rooms",
      error: error.message,
    });
  }
};

export const uploadNewGcData = async (req, res) => {
  try {
    console.log("Uploading new GC data...");
    const roomImage = req.file.path;
    const { roomName } = req.body;
    const roomId = req.params.roomId;
    console.log(roomImage, roomName, roomId);
    const room = await Room.findByIdAndUpdate(
      roomId,
      { roomImage, roomName: roomName },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Room image uploaded successfully",
      room,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getRoom = async (req, res) => {
//   try {
//     const room = await Room.findBy({
//       members: req.user._id,
//     }).populate("members", "name email");
//     if (!room) {
//       return res.status(404).json({
//         success: false,
//         message: "Room not found or you are not a member of this room",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Room fetched successfully",
//       room,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error while fetching room",
//       error: error.message,
//     });
//   }
// };
