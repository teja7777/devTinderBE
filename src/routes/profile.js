const express = require("express");
const profile = express.Router();
const bcrypt = require("bcrypt")

const User = require("../models/users");
const userAuth = require("../middleware/auth");
const { validatePassword } = require("../utils/validation");


profile.get("/profile/all", userAuth, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ message: "All users", data: users, total: users.length })
    } catch (err) {
        res.status(400).send(err)
    }
});

profile.get("/profile/me", userAuth, (req, res) => {
    try {
        const { user } = req;
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err)
    }
});

profile.patch("/profile/update", userAuth, async (req, res) => {
    try {
        const { user } = req;
        const updates = Object.keys(req?.body || {});
        const allowed_values = ["firstName", "lastName", "age", "gender", "about", "photoUrl"];

        if (updates?.length === 0) {
            return res.status(200).json({ message: "No Fields have Updated", data: user });
        }

        const isValidFields = updates.every(field => allowed_values.includes(field));
        if (!isValidFields) {
            return res.status(400).json({ message: "Filed to Update", reason: `You are allowed to update only ${allowed_values.join()}` })
        };

        updates.forEach(field => user[field] = req.body[field]);
        await user.save();
        res.status(200).json({ message: "User Updated Successfully", data: user })
    } catch (err) {
        res.status(400).send("Something went wrong", err);
    }
});

profile.delete("/profile/:user_id", userAuth, async (req, res) => {
    const { user_id } = req?.params;
    console.log(user_id)
    try {
        const user = await User.findByIdAndDelete(user_id);
        if (!user) {
            return res.send("Profile not found");
        }
        const all_users = await User.find({});
        res.status(200).json({ message: "Users Deleted Sucessfully", data: all_users });
    } catch (err) {
        res.status(400).send("Failed to Delete")
    }
});

profile.patch("/profile/update_password", userAuth, async (req, res) => {
    const isPasswordValid = validatePassword(req.body.password);
    if (!isPasswordValid.valid) {
        return res.status(400).send(isPasswordValid.message);
    }
    const { user } = req;
    try {
        user.password = await bcrypt.hashSync(req.body.password, 10);
        await user.save();
        res.send("Password Updated Successfully");
    } catch (err) {
        res.status(400).send("Failed to update password");
    }
});

module.exports = profile;