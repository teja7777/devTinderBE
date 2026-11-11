const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "intrested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
});

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    };
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;