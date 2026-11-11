const User = require("../models/users");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies || {};

        if (!token) {
            return res.status(401).send("Unauthorized user");
        }

        const decoded = await jwt.verify(token, "Teja@6392");
        const userId = decoded._id || decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(400).send("Authentication Error: " + error.message);
    }
};

module.exports = userAuth;