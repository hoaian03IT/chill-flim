const mongoose = require("mongoose");

const copyrightSchema = new mongoose.Schema(
    {
        film_id: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
        provider_nam: { type: String },
        expiration_date: { type: Date },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Copyright", copyrightSchema);
