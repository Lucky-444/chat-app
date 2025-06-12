import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Assuming you have a User model

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt; // Get the JWT from cookies
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if(!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    // req.user = decoded; // Attach user info to the request object
    // Optionally, you can fetch the user from the database if needed
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the user object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Forbidden access" });
  }
};



