const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 6,
        max: 255,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("User", userSchema);
