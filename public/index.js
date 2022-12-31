const express = require('express');
 const router = require('./routes/user');
const auth = require('./routes/Authentication');
const {auth: checkAuth} = require('./controllers/db');

const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());

app.use(express.json());

require('./Config/dataConfig');

const PORT = 3000;
app.use('/user', checkAuth, router);
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.json({status: "API is working properly"});
})

app.listen(PORT, () => {
    console.log("Server started at port", PORT);
})