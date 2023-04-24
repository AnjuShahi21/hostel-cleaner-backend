const {
    Account, CleanRequest, Feedback, Cleaner
} = require('../models/data')
require('dotenv').config();

const password = process.env.PASSWORD;

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
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, password)
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
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

// Generating and Saving Token on login
const generateAuthToken = async function (user) {
    const token = jwt.sign({ _id: user._id.toString() }, password)
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
            throw new Error("user is not registered");
        }

        res.status(200).json(response);
    } catch (e) {
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
        res.json({ Error: e.message }).status(400)
    }

}

const getProfileFull = async (req, res) => {
    try {
        const id = req.params.id;
        // All the products
        let data = await Account.findById(id);
        data.tokens = undefined;
        data.isAuth = undefined;
        data.userType = undefined;
        if (!data) {
            throw new Error("Not Saved");
        }
        res.status(200).json(data);
    } catch (e) {
        res.json({ Error: e.message }).status(400)
    }

}

const getUserWiseApprovedCleaner = async (req, res) => {
    try {
        const request = await CleanRequest.findOne({ roll_no: req.body.roll_no, reqStatus: 'approved' });
        const cleaner = await Cleaner.findOne({ cleanwer_id: request['cleaner_id'] });
        if (!request || !cleaner) {
            throw new Error('No Request found')
        }
        cleaner._doc.cleaning_time = request.cleaningTime;
        res.status(200).json(cleaner);
    } catch (e) {
        res.json({ Error: e.message }).status(400)
    }
}

//Deleting Data----------------------
const deleteAccountByMail = async (req, res) => {
    try {
        const mail = req.params.mail;
        const data = await Account.findOneAndDelete({ email: mail });
        if (!data) {
            throw new Error("Some error occured on deletion");
        }
        res.status(200).json(data);

    } catch (e) {
        res.status(400).json({ Error: e.message })
    }

}


// Updating Data ---------------------------------------

const findAndUpdateAccount = async (req, res) => {
    try {
        const filter = { email: req.body.email };
        delete req.body.email;
        const update = { $set: req['body'] };
        const response = await Account.findOneAndUpdate(filter, update, { new: true });
        if (!response) {
            throw new Error("Not Saved");
        }
        res.status(200).json(response);

    } catch (e) {
        res.status(400).json({ Error: e.message })
    }
}


// get requests
const getProfileData = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, password);
        const response = await Account.findById(decode._id.toString());
        response.tokens = undefined;
        if (!response) {
            throw new Error("Unable to find Profile");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }

}

const getSuggestion = async (req, res) => {
    try {
        const response = await Feedback.find({ suggestion: { $exists: true } })
        if (!response) {
            throw new Error("Unable to find suggesstion");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }

}

const getComplaint = async (req, res) => {
    try {
        const response = await Feedback.find({ complaint: { $exists: true } })
        if (!response) {
            throw new Error("Unable to find complain");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }
}

const getRequests = async (req, res) => {
    try {
        const response = await CleanRequest.find()
        if (!response) {
            throw new Error("Unable to find request");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }
}


const getRequest = async (req, res) => {
    try {
        const response = await CleanRequest.findOne({ roll_no: req.body.roll_no });
        const acc = await Account.findOne({ roll_no: req.body.roll_no });
        if (!response || !acc) {
            throw new Error("Not Saved");
        }
        response._doc.room = acc.room;
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }

}


const getPendingRequests = async (req, res) => {
    try {
        const response = await CleanRequest.find({ reqStatus: 'pending' })
        if (!response) {
            throw new Error("No Pending request found");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }

}


const getFreeCleaners = async (req, res) => {
    try {
        const response = await Cleaner.find({ status: 'free' })
        if (!response) {
            throw new Error("No free cleaner found");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }

}


// post requests
const sendRequest = async (req, res) => {
    try {
        const alreadyExist = await CleanRequest.findOne({ roll_no: req.body.roll_no, reqStatus: { $in: ["pending", "approved"] } })
        if (alreadyExist) {
            throw new Error("Request already exists");
        }
        const newCleanRequest = new CleanRequest(req.body);
        const response = await newCleanRequest.save();
        if (!response) {
            throw new Error("Not Saved");
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }
}

const sendFeedback = async (req, res) => {
    try {
        req.body.date = new Date();
        if (req.body.suggestion == "") {
            delete req.body.suggestion
        }
        if (req.body.complaint == "") {
            delete req.body.complaint
        }
        const servedCleaner = await Cleaner.findOneAndUpdate({ cleaner_id: req.body.cleaner_id },
            { status: 'free', $inc: { served: 1 } }
        );
        const cleanRequest = await CleanRequest.findOneAndUpdate({ roll_no: req.body.roll_no, reqStatus: 'approved' },
            { reqStatus: 'completed' }
        );
        req.body["cleaner_name"] = servedCleaner["name"];
        const newFeedback = new Feedback(req.body);
        const response = await newFeedback.save();
        if (!response || !servedCleaner || !cleanRequest) {
            throw new Error("Not Saved");
        }
        res.status(200).json(response);
    } catch (e) {
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

        const changedRequest = await CleanRequest.findOneAndUpdate({ roll_no: selectedRequest["roll_no"] }, { reqStatus: "approved", cleaner_id: selectedCleaner['cleaner_id'] }, { new: true })
        const changedCleaner = await Cleaner.findOneAndUpdate({ cleaner_id: selectedCleaner.cleaner_id }, { status: 'busy', $inc: { alloted: 1 } }, { new: true })
        if (!changedRequest || !changedCleaner) {
            throw new Error("Not Saved");
        }
        res.status(200).json({ ...changedCleaner, ...changedRequest });
    } catch (e) {
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
            throw new Error("Unable to change request");
        }
        res.status(200).json(changedRequest);
    } catch (e) {
        res.status(400).json({ Error: e.message })
    }
}


const addNewCleaner = async (req, res) => {
    try {
        const newCleaner = new Cleaner(req.body);
        const response = await newCleaner.save();
        if (!response) {
            throw new Error("Unable to add cleaner");
        }
        res.status(200).json(response);
    } catch (e) {
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
    getProfileData,
    getSuggestion,
    getComplaint,
    getRequests,
    getRequest,
    getUserWiseApprovedCleaner,
    getPendingRequests,
    getFreeCleaners,


    sendRequest,
    sendFeedback,

    allotCleaner,
    requestComplete,
    addNewCleaner,
    verifyStudent

}
