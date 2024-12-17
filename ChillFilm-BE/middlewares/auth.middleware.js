const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    try {
        // Bearer tokenstring
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        console.log(decoded);
        if (decoded) {
            req.userData = decoded;
            next();
        }
    } catch (error) {
        res.status(401).json({ status: false, message: "Your session is not valid.", data: error });
    }
}

function verifyRefreshToken(req, res, next) {
    const token = req.body.token;

    if (token === null) return res.status(401).json({ status: false, message: "Invalid request." });
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        if (decoded) {
            req.userData = decoded;
            next();
        }
    } catch (error) {
        console.log("loix");
        console.error(error);

        res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
    }
}

module.exports = {
    verifyToken,
    verifyRefreshToken,
};
