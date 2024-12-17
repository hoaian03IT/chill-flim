const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Types.ObjectId, ref: "User" },
        payment_amount: { type: Number, default: 0, required: true },
        status: { type: String, required: true },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
