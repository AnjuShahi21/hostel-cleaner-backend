// Configuring the Database here
const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URI)
// .then(res => console.log("Connected to Database"))
// .catch(err => console.log("Error:", err.message));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('database connected'))
    .catch((error) => console.log('error', error.message))
