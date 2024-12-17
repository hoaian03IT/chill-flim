const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        language: { type: String, required: true },
        genre: [{ type: String, required: true }],
        duration: { type: Number },
        overview: { type: String, required: true },
        rate: [{ type: Number, required: true }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Film", filmSchema);
