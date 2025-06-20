import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config(); // Load environment variables from .env file
// ... rest of your code
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
