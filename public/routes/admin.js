
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
   
////////////////////////////////////////////////////////
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




/////////////////////////////////////////////////////////////////////////////////////////////
//get request-->>
adminRouter.get('/getSuggestion',getSuggestion);
adminRouter.get('/getComplaint',getComplaint);


//put request--->>

//post request-->>

adminRouter.post('/allotCleaner', allotCleaner);
adminRouter.post('/requestComplete', requestComplete);
adminRouter.post('/addNewCleaner', addNewCleaner);
adminRouter.post('/verifyStudent', verifyStudent);






//delete request--->>>





module.exports = adminRouter;
