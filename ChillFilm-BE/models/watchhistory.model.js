const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        film_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Film" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("WatchHistory", watchHistorySchema);
