const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connect = async (req, res) => {
    try {
        await mongoose.connect(process.env.DB_CONN_STRING);
        console.log("Connect database successfully!");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connect;
