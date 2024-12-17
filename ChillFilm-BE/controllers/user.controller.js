const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const redis_client = require("../db/redis_connect.js");
const bcrypt = require("bcrypt");

async function Register(req, res) {
    try {
        const { username, password } = req.body;
        const saltRounds = 10;
        let hashpw = await bcrypt.hash(password, saltRounds);

        let existed = await User.exists({ username: username });

        if (existed) return res.status(406).json({ message: "username already exists" });

        const user = new User({
            username,
            password: hashpw,
        });

        const saved_user = await user.save();
        res.status(200).json({ status: true, data: saved_user, message: "Registered successfully." });
    } catch (error) {
        res.status(400).json({ status: false, message: "Registered failed." });
    }
}

async function Login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username }).exec();
        if (user === null) {
            res.status(401).json({ status: false, message: "Login failed." });
        }

        let valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
            return res.status(401).json({ status: false, message: "Login failed." });
        }

        const access_token = jwt.sign({ sub: user._id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TIME,
        });

        const { refresh_token, maxAge } = GenerateRefreshToken(user._id);
        res.cookie("refresh-token", refresh_token, {
            maxAge: maxAge,
            httpOnly: true,
            secure: true,
        })
            .status(200)
            .json({ status: true, message: "login success", data: { access_token } });
    } catch (error) {
        console.error(error);

        res.status(400).json({ status: false, message: "Login failed." });
    }
}

async function RefreshToken(req, res) {
    try {
        const refreshToken = req.cookies["refresh-token"];

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, userInfo) => {
            if (err) {
                console.error(err);
                return;
            }

            const tokenKey = `${userInfo?.sub}:refreshtoken:${refreshToken}`;
            // kiểm tra xem token đã hết hạn chưa
            let result = await redis_client.get(tokenKey);

            if (!result) {
                return res.status(403).json({ errorCode: "unauthenticated" });
            }
            // xoa refreshtoken khoi redis
            await redis_client.del(tokenKey);

            const { refresh_token, maxAge } = GenerateRefreshToken(userInfo?.sub);
            const access_token = jwt.sign({ sub: userInfo?.sub }, process.env.JWT_ACCESS_SECRET, {
                expiresIn: process.env.JWT_ACCESS_TIME,
            });

            res.cookie("refresh-token", refresh_token, {
                maxAge: maxAge,
                httpOnly: true,
                secure: true,
            })
                .status(200)
                .json({ messageCode: "REFRESH_TOKEN", token: access_token });
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({ status: false, message: "Refresh failed." });
    }
}

function GenerateRefreshToken(user_id) {
    let maxAge = 60 * 1000 * 60 * 24 * 30;
    const refresh_token = jwt.sign({ sub: user_id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TIME,
    });

    redis_client
        .set(`${user_id?.toString()}:refreshtoken:${refresh_token}`, 1, { EX: maxAge })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        });

    return { refresh_token, maxAge };
}

function GetAccessToken(req, res) {
    const user_id = req.userData.sub;
    const access_token = jwt.sign({ sub: user_id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TIME,
    });
    const refresh_token = GenerateRefreshToken(user_id);
    return res.json({ status: true, message: "success", data: { access_token, refresh_token } });
}

async function Logout(req, res) {
    const user_id = req.userData.sub;
    const token = req.token;

    // remove the refresh token
    await redis_client.del(user_id.toString());

    // blacklist current access token
    await redis_client.set("BL_" + user_id.toString(), token);

    return res.json({ status: true, message: "success." });
}

module.exports = {
    Register,
    Login,
    GenerateRefreshToken,
    Logout,
    GetAccessToken,
    RefreshToken,
};
