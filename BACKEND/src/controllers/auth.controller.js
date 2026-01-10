import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
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
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 12344 =>
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

   
        // authenticate user
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res);

        res.status(201).json({
           _id: newUser._id,
           fullName : newUser.fullName,
           email: newUser.email,
           profilePic: newUser.profilePic,
        });

        try{
           await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
        }catch(error){
           console.log("Failed to send welcome email", error);
        }

   
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({message: "Internal server error."})
  }
};

export const login = async (req, res) => {
  res.send("login endpoint");
};
