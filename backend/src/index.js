import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js"; // Importing the database connection utility
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // Importing CORS middleware
import {app , server } from "./utils/socket.js";

// Importing the authentication routes
dotenv.config(); // Load environment variables from .env file
// Importing the express package to create a web server


const port = process.env.PORT || 5000; // Setting the port to listen on, defaulting to 3000 if not specified in environment variables
// Importing the dotenv package to load environment variables

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Setting up CORS to allow requests from the frontend server
// Middleware to parse JSON bodies
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(cookieParser());

connectDB(); // Establishing a connection to the MongoDB database

// Mounting the authentication routes at /api/auth
app.use("/api/auth", authRoutes); // Mounting the authentication routes at /api/auth
app.use("/api/messages", messageRoutes); // Mounting the message routes at /api/auth

// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
