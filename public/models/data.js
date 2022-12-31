
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// All the schemas/structures here




const account = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
   
    userType: {
        type: String,
        required: true
    },

    // Default value generated is false
    // Used to show blue tick
    isTrusted: {
        type: Boolean,
        default: false
    },

    // Check if account is authenticated
    // Didn't show user is false
    isAuth: {
        type: Boolean,
        default: false
    },

    // Token of all the logged in session
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})




const Account = new mongoose.model('Account', account);


module.exports = {
    
    Account,
   
}
