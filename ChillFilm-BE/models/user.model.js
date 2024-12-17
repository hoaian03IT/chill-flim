const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 6,
            max: 255,
            unique: true,
        },
        password: {
            type: String,
            min: 6,
            max: 255,
            require: true,
        },
        email: { type: String, unique: true },
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
