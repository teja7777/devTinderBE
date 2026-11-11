const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connection");
const User = require("../models/users");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName email age gender photoUrl about"

// The requests which are sent
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested"
        }).populate("fromUserId", USER_SAFE_DATA);
        console.log(connectionRequests);
        res.status(200).json({ data: connectionRequests })
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

// The connections already connected
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId;
        })
        res.json({ data: connections })
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

// All the users which are not connected or denied 
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        limit = limit > 50 ? 50 : limit;


        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select("fromUserId toUserId");

        const hideUsers = new Set();

        connectionRequests.forEach((req) => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        })


        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsers) } },
                { _id: { $ne: loggedInUserId } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users)
    } catch (err) {
        res.status(400).send("Error + :", err.message);
    }
});

module.exports = userRouter;