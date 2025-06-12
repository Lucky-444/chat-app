import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../utils/coloudinary.js";
import { getRecieverSocketId , io } from "../utils/socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    // Fetch all users except the logged-in user

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Extracting the ID from the request parameters
    const myId = req.user._id; // Getting the logged-in user's ID from the request object
    //get all message by sender and receiver

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; //the message could be a text or any image
    const { id: receiverId } = req.params; //get the receiverId from req.params
    const senderId = req.user._id; //my id

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("❌ Cloudinary Upload Failed:", err.message);
        return res.status(400).json({ message: "Image upload failed" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //// todo : real time functionality used here by using socket.io

    const receiverSocketId = getRecieverSocketId(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage" , newMessage);
    }





    res.status(201).json({
      message: "Message sent successfully",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
