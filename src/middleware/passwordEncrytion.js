// import UserSchema from "../models/User";

// console.log(
//     "Password Encryption Middleware Loaded",
// )

// UserSchema.pre("save",async function(next){
//     if(!this.isModified("password")){
//         return next();
//     }
//     if(this.password!== this.confirmPassword){
//         throw new Error("Password and Confirm Password do not match");
//     }
//     try{
//         const salt=await bcrypt.gensalt(10);
//         const hashedPassword=await bcrypt.hash(this.password,salt);
//         this.password=hashedPassword;
//         this.confirmPassword=undefined;
//         next();
// ;    }catch(error){
//         throw new Error("Error while hashing password");
//     }
// })