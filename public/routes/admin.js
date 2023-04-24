
// All the user actions like update, delete etc here
const express = require('express');
const adminRouter = express.Router();
const { 
    
    addAccount, 
    deleteAccountByMail,
    findAndUpdateAccount,
    getProfileFull,
    getSuggestion,
    getComplaint,
    getRequests,
    getRequest,
    getPendingRequests,
    getFreeCleaners,
 
    allotCleaner,
    requestComplete,
    addNewCleaner,
    verifyStudent
   
} = require('../controllers/db');

// Adding Data to Database

adminRouter.post('/addAccount', addAccount);


// Getting Data from Database

adminRouter.get('/profileFull/:id', getProfileFull);


// Deleting Data from Database

adminRouter.delete('/deleteAccountByMail/:mail', deleteAccountByMail)

// Updating Data in Database
adminRouter.put('/findByMailAndUpdate', findAndUpdateAccount);

//get request-->>
adminRouter.get('/getSuggestion',getSuggestion);
adminRouter.get('/getComplaint',getComplaint);
adminRouter.get('/getRequests',getRequests);
adminRouter.post('/getRequests',getRequest);
adminRouter.get('/getPendingRequests',getPendingRequests);
adminRouter.get('/getFreeCleaners',getFreeCleaners);

//post request-->>

adminRouter.post('/allotCleaner', allotCleaner);
adminRouter.post('/requestComplete', requestComplete);
adminRouter.post('/addNewCleaner', addNewCleaner);
adminRouter.post('/verifyStudent', verifyStudent);


module.exports = adminRouter;
