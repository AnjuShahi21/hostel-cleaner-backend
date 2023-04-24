
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// All the schemas/structures here

const account = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    roll_no: {
        type: String,
        unique: true
    },
    room: {
        type: String,
    },
    floor: {
        type: String,

    },
    hostel: {
        type: String,

    },
    userType: {
        type: String,
        default: "student"
    },


    // Token of all the logged in session
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


const cleanRequest = new mongoose.Schema({
    roll_no: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    cleaningTime: {
        type: String,
        required: true
    },
    cleaner_id: {
        type: String
    },
    reqStatus: {
        type: String,
        default: "pending"
    }
})


const feedback = new mongoose.Schema({
    date: {
        type: Date
    },
    room: {
        type: String,
        required: true

    },
    cleaner_name: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    cleaning_time: {
        type: String,
        required: true
    },
    timein: {
        type: String,
        required: true
    },
    timeout: {
        type: String,
        required: true
    },
    suggestion: {
        type: String

    },
    complaint: {
        type: String

    }

})


const cleaner = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'free'
    },
    gender: {
        type: String,
        required: true
    },
    cleaner_id: {
        type: Number,
        unique: true

    },
    mobile_no: {
        type: Number,
        required: true
    },

    served: {
        type: Number,
        default: 0

    },
    alloted: {
        type: Number,
        default: 0
    }
})



const Feedback = new mongoose.model('Feedback', feedback);
const CleanRequest = new mongoose.model('CleanRequest', cleanRequest);
const Cleaner = new mongoose.model('Cleaner', cleaner);
const Account = new mongoose.model('Account', account);



module.exports = {
    Account,
    CleanRequest,
    Feedback,
    Cleaner,
}
