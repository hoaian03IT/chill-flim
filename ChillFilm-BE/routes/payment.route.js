const route = require("express").Router();
const PaymentController = require("../controllers/payment.controller.js");
const auth_middleware = require("../middlewares/auth.middleware.js");

route.post("/create-order", auth_middleware.verifyToken, PaymentController.createOrder);
route.post("/complete-order", auth_middleware.verifyToken, PaymentController.completeOrder);

module.exports = route;
