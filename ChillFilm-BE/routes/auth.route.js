const route = require("express").Router();
const user_controller = require("../controllers/user.controller.js");
const auth_middleware = require("../middlewares/auth.middleware.js");

const rateLimit = require("express-rate-limit");

// Cấu hình rate limit cho login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Tối đa 5 requests trong 15 phút
    message: { message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau." },
    standardHeaders: true, // Gửi thông tin rate limit qua header `RateLimit-*`
    legacyHeaders: false, // Không gửi thông tin rate limit qua header `X-RateLimit-*`
});

route.post("/register", user_controller.Register);
route.post("/login", loginLimiter, user_controller.Login);
route.post("/token", auth_middleware.verifyRefreshToken, user_controller.GetAccessToken);
route.get("/logout", auth_middleware.verifyToken, user_controller.Logout);
route.get("/refresh-token", user_controller.RefreshToken);

module.exports = route;
