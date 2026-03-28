import * as UserServices from "../services/UserServices.js";


export const getUserUsingName=(req,res)=>{
      return UserServices.getUserByName(req,res);

}


export const updateMe=(req,res)=>{
      return UserServices.updateProfile(req,res);
}
