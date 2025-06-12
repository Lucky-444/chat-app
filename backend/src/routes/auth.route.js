import express from "express";
import { login, logout, signup, updateProfile  , checkAuth} from "../controllers/auth.controller.js"; // Importing the authentication controller functions
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Importing the authentication middleware
const router = express.Router();

//req send
//http://localhost:3000/api/auth/signup
/**
 * body : {
 *     
    "fullname" : "john doe",
     "email" : "doe@gmail.com",
     "password" : "123456789"

 * }
 */
router.post("/signup", signup);



// req send
//http://localhost:3000/api/auth/login
/**
 * body{
 *  "email" : "doe@gmail.com",
 *  "password" : "123456789"
 * }
 */
router.post("/login", login);


// req send
//http://localhost:3000/api/auth/logout

router.post("/logout", logout);




//for updating the user profile, you can create a new route
//it only update the user profile picture
//can not update the email and password
//http://localhost:3000/api/auth/update-profile
/**
 * body : {
 *  "profilePicture" : "image url"
 * }
 * 
 * Note: The profilePicture should be a base64 encoded string or a URL of the image
 */
router.put("/update-profile",authMiddleware ,updateProfile);


//check if the user is authenticated
// This route can be used to check if the user is authenticated
router.get("/check" ,authMiddleware, checkAuth);



export default router;
