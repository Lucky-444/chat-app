import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getAllUsers  , getMessageById , sendMessage } from '../controllers/message.controller.js';

const router = express.Router();
//req send 
//http://localhost:3000/api/message/get-users
//no body required, just need to be authenticated
// just need to be authenticated and logged in user
// Define the route to get all users, protected by authentication middleware
router.get('/get-users', authMiddleware , getAllUsers);


//req send 
//
//to get all the messages by the sender and reciever from both ends
router.get('/:id',authMiddleware , getMessageById);



//req send
//
//to send a message to another person
router.post('/send/:id',authMiddleware ,sendMessage);


export default router;