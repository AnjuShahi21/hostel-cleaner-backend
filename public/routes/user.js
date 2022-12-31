
// All the user actions like update, delete etc here
const express = require('express');
const router = express.Router();
const { 
    
    addAccount, 
    deleteAccountByMail,
    findAndUpdateAccount,
    getProfileFull,
   
} = require('../controllers/db');

// Adding Data to Database

router.post('/addAccount', addAccount);


// Getting Data from Database

router.get('/profileFull/:id', getProfileFull);


// Deleting Data from Database

router.delete('/deleteAccountByMail/:mail', deleteAccountByMail)

// Updating Data in Database
router.put('/findByMailAndUpdate', findAndUpdateAccount);

module.exports = router;
