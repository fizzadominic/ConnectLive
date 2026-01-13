import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// send message in real using socke.io
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    
    const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);

   
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatObjectId },
        { senderId: userToChatObjectId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// messages between me and a user
export const sendMessage = async (req, res) => {
     try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

};


// create chatPartners
export const  getChatsPartners =  async (req ,res) => {
  try {
     const loggedInUserId = req.user._id.toString();

    //  find all the loggedin user either sender or reciver
     
    const messages = await Message.find({
      $or : [{receiverId : loggedInUserId}, {senderId : loggedInUserId}]
    })
    
    const chatPartnersId = [...new Set(messages.map((msg) => 
      msg.senderId.toString() === loggedInUserId
      ? msg.receiverId.toString()
      : msg.senderId.toString())
    )];

    const chatPartners = await User.find({_id : {$in:chatPartnersId}}).select("-password");

    res.status(200).json(chatPartners);

  } catch (error) {
       console.log("Error in chatPartner controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
    
  }
};