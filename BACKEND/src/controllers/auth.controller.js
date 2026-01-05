import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password atleast should be 6 characters" });
    }
    // check if emails is a valid address : regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email formate" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 12344 =>
    const salt = await bcrypt.genSalt(10);
    const hashPasword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPasword,
    });

    if(newUser){
        // authenticate user
        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
           _id: newUser._id,
           fullName : newUser.fullName,
           email: newUser.email,
           profilePic: newUser.profilePic,
        });

    }else{
        res.status(400).json({message:"Invalid user data."})
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({message: "Internal server error."})
  }
};

export const login = async (req, res) => {
  res.send("login endpoint");
};
