import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [6, "Password must be at least 6 characters long"],
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: [6, "Confirm Password must be at least 6 characters long"],
  },
  avatarUrl: {
    type: String,
    default:
      "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please fill a valid 10-digit phone number"],
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    if (this.password !== this.confirmPassword) {
      throw new Error("Password and Confirm Password do not match");
    }
  
    const password = this.password;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
    this.confirmPassword = undefined;
  } catch (error) {
    throw new Error("Error while hashing password");
  }
});

//Comparing Password
UserSchema.methods.comparePassword=async function (password,hashedPassword){
     try{
        return await bcrypt.compare(password,hashedPassword);
     }catch(error){
        throw new Error("Error while comparing password");
     }
}

const User = mongoose.model("User", UserSchema);

export { User };
