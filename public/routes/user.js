
// All the user actions like update, delete etc here
const { request } = require('express');
const express = require('express');
const { get } = require('mongoose');
const userRouter = express.Router();
const { 
    
    addAccount, 
    deleteAccountByMail,
    findAndUpdateAccount,
    getProfileFull,
    getProfileData,
    getUserWiseApprovedCleaner,
 
    sendRequest,
    sendFeedback,
    allotCleaner
   
   
} = require('../controllers/db');

// Adding Data to Database

userRouter.post('/addAccount', addAccount);


// Getting Data from Database

userRouter.get('/profileFull/:id', getProfileFull);


// Deleting Data from Database

userRouter.delete('/deleteAccountByMail/:mail', deleteAccountByMail)

// Updating Data in Database
userRouter.put('/findByMailAndUpdate', findAndUpdateAccount);


///////////////////////////////////////////////////////////////////////////////////////////////


// get request
userRouter.get('/getProfileData', getProfileData);

// post requestendRequest
userRouter.post('/sendRequest', sendRequest);
userRouter.post('/sendFeedback', sendFeedback);
userRouter.post('/getUserWiseApprovedCleaner', getUserWiseApprovedCleaner);


module.exports = userRouter;
