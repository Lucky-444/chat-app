import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token will expire in 30 days
  });
  console.log(token);
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    //prevents XSS attacks and cross-site scripting attacks
    //prevents the cookie from being accessed by JavaScript in the browser
    secure: process.env.NODE_ENV != "production", // Set to true in production to ensure the cookie is sent over HTTPS

    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
    sameSite: "strict", // Helps prevent CSRF attacks by ensuring the cookie is sent only for same-site requests
  });

  return token;
};
