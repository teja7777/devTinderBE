const express = require("express");
const connectionRouter = express.Router();

const userAuth = require("../middleware/auth");
const User = require("../models/users");
const ConnectionRequest = require("../models/connection");

connectionRouter.post("/connection/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const isValidToUserId = await User.findById(toUserId);
        if (!isValidToUserId) {
            return res.status(400).send({ message: "User not found" })
        }

        const allowedValues = ["intrested", "ignored"];
        if (!allowedValues.includes(status)) {
            return res.status(400).send(`${status} is not a valid status`);
        }

        const isAlreadyConnected = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (isAlreadyConnected) {
            return res.status(400).send("Connection already exists");
        }

        const connection = new ConnectionRequest({ fromUserId, toUserId, status });
        const data = await connection.save();
        res.status(200).json({ message: `${req.user.name} is intrested in ${isValidToUserId.name}`, data })

    } catch (err) {
        return res.status(400).send("Error : " + err.message);
    };
});

connectionRouter.post("/connection/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const { status, requestId } = req.params;

        const allowedStatuses = ["accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send(`This ${status} type is not acceptable.Please send proepr status`);
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "intrested"
        });
        if (!connectionRequest) {
            return res.status(400).json({ message: "No connection request exists" });
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        return res.status(200).json({ message: `Request is ${status}`, data: connectionRequest });
    } catch (err) {
        return res.status(400).send(err.message);
    }
})

module.exports = connectionRouter;
