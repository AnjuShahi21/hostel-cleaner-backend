const {
    Account, CleanRequest, Feedback, Cleaner
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
        const response = await Account.findOne({ email: user.email });

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

        const filter = { email: req.body.email };
        delete req.body.email;
        console.log(req.body.email);

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



////////////////////////////////////////////////////////////////////////////////////////////////

// get requests
const getProfileData = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismynewcourse');
        const response = await Account.findById(decode._id.toString());
        response.tokens = undefined;

        if (!response) {
            throw new Error("Not Saved");
        }
        console.log(response)
        res.status(200).json(response);
    } catch (e) {

        console.log(e.message);

        res.status(400).json({ Error: e.message })
    }

}



const getSuggestion = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismynewcourse');
        const response = await Feedback.find()
        if (!response) {
            throw new Error("Not Saved");
        }
        console.log(response)
        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}

const getComplaint= async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismynewcourse');
        const response = await Feedback.find()
        if (!response) {
            throw new Error("Not Saved");
        }
        console.log(response)
        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}




// put requests
// post requests
const sendRequest = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismynewcourse');
        const newCleanRequest = new CleanRequest(req.body);
        const response = await newCleanRequest.save();
        console.log("shahi")
        if (!response) {
            throw new Error("Not Saved");
        }
        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }
}


const sendFeedback = async (req, res) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'thisismynewcourse');
        req.body.date = new Date();
        const newFeedback = new Feedback(req.body);
        const response = await newFeedback.save();
        if (!response) {
            throw new Error("Not Saved");
        }
        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}


const allotCleaner = async (req, res) => {
    try {
        const selectedRequest = await CleanRequest.findOne({ roll_no: req.body.roll_no, reqStatus: 'pending' });
        const selectedCleaner = await Cleaner.findOne({ cleaner_id: req.body.cleaner_id, status: 'free' });

        if (!selectedRequest || !selectedCleaner) {
            throw new Error("Not Saved");
        }

        const changedRequest = await CleanRequest.findOneAndUpdate({ req_id: selectedRequest["req_id"] }, { reqStatus: "approved" }, { new: true })
        const changedCleaner = await Cleaner.findOneAndUpdate({ cleaner_id: selectedCleaner.cleaner_id }, { status: 'busy' }, { new: true })

        if (!changedRequest || !changedCleaner) {
            throw new Error("Not Saved");
        }
        res.status(200).json({ ...changedCleaner, ...changedRequest });
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }
}



const requestComplete = async (req, res) => {

    try {
        const selectedRequest = await CleanRequest.findOne({ req_id: req.body.req_id });
        if (!selectedRequest) {
            throw new Error("Not Saved");
        }
        const changedRequest = await CleanRequest.findOneAndUpdate({ req_id: selectedRequest["req_id"] }, { reqStatus: "completed" }, { new: true })

        if (!changedRequest) {
            throw new Error("Not Saved");
        }
        res.status(200).json(changedRequest);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }
}


const addNewCleaner = async (req, res) => {
    try {
        const newCleaner = new Cleaner(req.body);
        const response = await newCleaner.save();

        if (!response) {
            throw new Error("Not Saved");
        }

        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }
}

const verifyStudent = async (req, res) => {
    try {
        const email = req.body.email;
        const changedStatus = await Account.findOneAndUpdate({ email, status: "pending" }, { status: "verified" }, { new: true })
        if (!changedStatus) {

            throw new Error("Not Saved");
        }
        changedStatus.password = undefined;
        changedStatus.tokens = undefined;

        res.status(200).json(changedStatus);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ Error: e.message })
    }

}

// delete requests
module.exports = {
    addAccount,
    deleteAccountByMail,
    findAndUpdateAccount,
    findAccount,
    auth,
    getProfileOverview,
    getProfileFull,
    //////////////////////////////////////////////////////
    getProfileData,
    getSuggestion,
    getComplaint,


    sendRequest,
    sendFeedback,

    allotCleaner,
    requestComplete,
    addNewCleaner,
    verifyStudent

}
