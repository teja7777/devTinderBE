const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("../utils/validation");



authRouter.post("/signup", async (req, res) => {
    const validationResult = validateSignupData(req);
    if (!validationResult.valid) {
        return res.status(400).send(validationResult.message);
    }
    const hashedPassword = bcrypt.hashSync(req?.body?.password, 10);
    const user = new User({ ...req?.body, password: hashedPassword });
    try {
        await user.save();
        res.status(201).json({ message: "User Saved Successfully", data: req.body })
    } catch (err) {
        res.status(400).send(err)
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        };
        const IsPasswordValid = bcrypt.compareSync(password, user.password);
        if (!IsPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ _id: user._id }, "Teja@6392", { expiresIn: "5d" });
        res.cookie("token", token);
        res.status(200).json({ message: "Login Success", data: user });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).send("Logout Sucessful");
})

module.exports = authRouter;