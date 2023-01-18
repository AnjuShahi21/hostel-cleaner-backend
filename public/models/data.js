
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// All the schemas/structures here


//account=student account
const account = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,    
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:"pending"
    },
    rollNo: {
        type: String,
        required:true,
        unique:true

    },
    room: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    hostel: {
        type: String,
        required:true
    },


    // Token of all the logged in session
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})




const student = new mongoose.Schema({

    rollNo: {
        type: String,
        required:true

    },
    room: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    hostel: {
        type: String,
        required:true
    }
})

const admin = new mongoose.Schema({


    admin_id: {
        type: String,
        default: new mongoose.Types.ObjectId()
    },

    userName: {
        type: String,
        required: true
    },
    password: {
        type: Number,
        required: true

    },

    hostel: {
        type: String,
        required: true
    }
})


const cleanRequest = new mongoose.Schema({
    req_id: {

        type: String,
        default: new mongoose.Types.ObjectId(),
    },
    rollNo: {
        type: Number,
        required: true
    },
    cleaner_id: {
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
    reqStatus: {
        type: String,
        default:"pending"
    }
})


const feedback = new mongoose.Schema({
    feedback_id: {
        type: String,
        default: new mongoose.Types.ObjectId(),
    },
    req_id: {
        type: Number,
        required: true
    },
    rollNo: {
        type: Number,
        required: true
    },

    rating: {
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

})
const complaint = new mongoose.Schema({
    complaint_id: {
        type: String,
        default: new mongoose.Types.ObjectId(),
    },
    feedback_id: {
        type: Number,
        required: true
    },
    rollNo: {
        type: Number,
        required: true
    },

    complaint: {
        type: String,
        required: true
    },
})

const suggestion = new mongoose.Schema({
    suggest_id: {
        type: String,
        default: new mongoose.Types.ObjectId(),
    },
    feedback_id: {
        type: Number,
        reuired: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },

})


const cleaner = new mongoose.Schema({
    cleaner_id: {
        type: String,
        default: new mongoose.Types.ObjectId(),
    },
    name: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:'free'
    },

    gender: {
        type: String,
        required: true
    },
    mobNo: {
        type: String,
        required: true

    },
    hostel: {
        type: String,
        required: true
    },
})


const Student = new mongoose.model('Student', student);
const Admin = new mongoose.model('Admin', admin);
const Feedback = new mongoose.model('Feedback', feedback);
const Complaint = new mongoose.model('Complaint', complaint);
const Suggestion = new mongoose.model('Suggestion', suggestion);
const CleanRequest = new mongoose.model('CleanRequest', cleanRequest);
const Cleaner = new mongoose.model('Cleaner', cleaner);
const Account = new mongoose.model('Account', account);



module.exports = {

    Account,
    Student,
    Admin,
    CleanRequest,
    Feedback, Cleaner,
    Complaint,
    Suggestion

}
