const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://teja_new:Teja777@namaste-node.crnnwrw.mongodb.net/dev-tinder");
}

module.exports = connectDB;