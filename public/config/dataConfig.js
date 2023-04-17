// Configuring the Database here
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('database connected'))
    .catch((error) => console.log('error', error.message))
