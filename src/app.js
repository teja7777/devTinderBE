const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors")


const connectDB = require('./configurations/database.js');
const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const connectionRouter = require('./routes/connection.js');
const userRouter = require('./routes/user.js');

const app = express()
const port = 3000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch((error) => {
    console.log(`Error: ${error}`)
})


