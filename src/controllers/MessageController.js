import { sendMessages ,getMessages } from "../services/MessagesServices.js";

export const sendMessage=async(req,res)=>{
    return sendMessages(req,res);
}

export const getMessage=async(req,res)=>{
    console.log("getMessage");
    return getMessages(req,res);
}