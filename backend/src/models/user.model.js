import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema); // Creating a User model based on the userSchema
export default User; // Exporting the User model for use in other parts of the application
