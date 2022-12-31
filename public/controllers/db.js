const {
    Account
} = require('../models/data')


const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Used to check password by matching with hashed password
const findByCredentials = async (username, password) => {
    const user = await Account.findOne({ $or: [{ name: username }, { email: username }] });
    if (!user) {
        throw new Error('Unable to login | User Not Found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login | Password Not Matched')
    }
    return user
}

// Checking if the user is authenticated
const auth = async (req, res, next) => {
    // console.log(req.header('Authorization'));
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await Account.findOne({
            _id: decoded._id, 'tokens.token':
                token
        })
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        console.log(e.message);
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

// Generating and Saving Token on login
const generateAuthToken = async function (user) {
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })
    const changedUser = new Account(user);
    changedUser.save();
    return token
}




// Adding Data ----------------------------------------




const addAccount = async (req, res) => {

    try {
        req.body.password = await bcrypt.hash(req.body.password, 8)
        const newAccount = new Account(req.body);
        const response = await newAccount.save();

        if (!response) {
            throw new Error("Not Saved");
        }

        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}



// Method for login
const findAccount = async (req, res) => {

    try {
        const user = req.body;
        const response = await Account.findOne({   email: user.email  });

        // Matching password
        
        const isAuth = await findByCredentials(req.body.email, req.body.password);
      
        const token = await generateAuthToken(response);

        if (!response || !isAuth || !token) {
            throw new Error("Not Found");
        }

        response.tokens = undefined;
        response.password = undefined;

        res.status(200).json({ ...response, token });
    } catch (e) {
        console.log(e.message);
        res.status(404).json({ Error: e.message });
    }

}

const getProfileOverview = async (req, res) => {

    try {

        const id = req.params.id;

        // All the products
        let data = await Account.findById(id);

        data.tokens = undefined;
        data.email = undefined;
        data.isAuth = undefined;
        data.userType = undefined;

        if (!data) {
            throw new Error("Not Saved");
        }

        res.status(200).json(data);

    } catch (e) {
        console.log(e.message);
        res.json({ Error: e.message }).status(400)
    }

}

const getProfileFull = async (req, res) => {

    try {

        const id = req.params.id;

        // All the products
        let data = await Account.findById(id);

        data.tokens = undefined;
        data.aadhar = undefined;
        data.isAuth = undefined;
       
        data.userType = undefined;

        if (!data) {
            throw new Error("Not Saved");
        }

        res.status(200).json(data);

    } catch (e) {
        console.log(e.message);
        res.json({ Error: e.message }).status(400)
    }

}

//Deleting Data----------------------
const deleteAccountByMail = async (req, res) => {

    try {

        const mail = req.params.mail;
        const data = await Account.findOneAndDelete({ email: mail });

        if (!data) {
            throw new Error("Not Saved");
        }

        res.status(200).json(data);

    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}


// Updating Data ---------------------------------------

const findAndUpdateAccount = async (req, res) => {

    try {

        const filter = { email: req.body.mail };
        delete req.body.mail;

        const update = { $set: req['body'] };
        const response = await Account.findOneAndUpdate(filter, update, { new: true });

        if (!response) {
            throw new Error("Not Saved");
        }

        res.status(200).json(response);

    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}

module.exports = {
    
    addAccount,
    
    deleteAccountByMail,
    findAndUpdateAccount,
    findAccount,
    auth,
    getProfileOverview,
    getProfileFull,
    
}
