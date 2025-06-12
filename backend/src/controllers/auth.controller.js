import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/helper.js";
import cloudinary from "../utils/coloudinary.js";

export const signup = async (req, res) => {
  
  try {
    const { fullname, email, password } = req.body;
    // Validate input
    // Ensure all fields are provided
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      fullname,
      email,
      password, // Password will be hashed before saving
    });

    let user = newUser;

    //     //or you can do by this way also
    //     const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    //     const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the generated salt
    //     //1st hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Hashing the password with a salt rounds of 10
    user.password = hashedPassword; // Assign the hashed password to the user object

    console.log(user);
    // Save the user to the database
    if (user) {
      //generate a jwt token
      generateToken(user._id, res);

      await user.save();
      // Respond with the created user (excluding the password)
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: user,
      });
    } else {
      res.status(404).json({
        message: "some error occured",
        success: false,
        data: {},
      });
    }

    // Optionally, you can send a welcome email or perform other actions here
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate a JWT token
    generateToken(user._id, res);
    // Respond with the user data (excluding the password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 }); // Clear the JWT cookie
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id; // Assuming you have the user ID from the auth middleware
    // Validate input
    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadedImage = await cloudinary.uploader.upload(profilePicture);
    // Find the user by ID and update the profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadedImage.secure_url }, // Update the profile picture URL
      { new: true } // Return the updated user
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user, // 🔥 Make sure this includes `profilePicture`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


