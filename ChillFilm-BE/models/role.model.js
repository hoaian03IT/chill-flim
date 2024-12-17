const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        role_name: {
            type: String,
            require: true,
            min: 6,
            max: 255,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Role", roleSchema);
