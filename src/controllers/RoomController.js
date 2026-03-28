import * as RoomServices from "../services/RoomServices.js";


export const createRoom=async(req,res)=>{
    return RoomServices.createRoomGC(req,res);
}

export const createDMRoom=async(req,res)=>{
    return RoomServices.DMRoom(req,res);
}

export const getAllRooms=async(req,res)=>{
    return RoomServices.getRooms(req,res);
}

export const updateGC=async(req,res)=>{
    console.log("Updating GC...");
    return RoomServices.uploadNewGcData(req,res);
}