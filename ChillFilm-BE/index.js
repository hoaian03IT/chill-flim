require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const redis_client = require("./db/redis_connect");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(cors());
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

// rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    onLimitReached: (req, res) => {
        res.status(429).send({ message: "Too many requests, please try again later." });
    },
});

app.use("/api/v1/", limiter);

app.get("/api/v1/", (req, res) => {
    res.json({ status: true, message: "Welcome to ChillFilm API!" });
});

//connect database
const connect = require("./db/connect.js");
connect();

//routes
const auth_routes = require("./routes/auth.route.js");
const user_routes = require("./routes/user.route.js");
const payment_routes = require("./routes/payment.route.js");

app.use("/v1/auth", auth_routes);
app.use("/v1/user", user_routes);
app.use("/v1/payment", payment_routes);

app.listen(3000, () => console.log("server is running ..."));
