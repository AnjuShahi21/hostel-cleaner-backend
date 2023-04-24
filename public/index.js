const express = require('express');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const auth = require('./routes/Authentication');
const { auth: checkAuth } = require('./controllers/db');

const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

require('./config/dataConfig');

const PORT = 3000;

//remove checkauth
app.use('/user', checkAuth, userRouter);
app.use('/admin', checkAuth, adminRouter);
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.json({ status: "API is working properly" });
})

app.listen(PORT, () => {
    console.log("Server started at port", PORT);
})
