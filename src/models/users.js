const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxLength: 20 },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, maxLength: 30 },
    password: { type: String, required: true, minlength: 8, maxLength: 60 },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    about: { type: String, required: true },
    photoUrl: {
        type: String,
        default: "https://i.postimg.cc/85NRxPbC/dummy.jpg" // Optional: Provide a default avatar
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;