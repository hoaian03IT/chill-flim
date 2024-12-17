const client = require("../helpers/paypal.js");
const { performance } = require("perf_hooks");
const paypal = require("@paypal/checkout-server-sdk");
const sendErrorEmails = require("../helpers/nodemailer.js");
const User = require("../models/user.model.js");
const Transaction = require("../models/transaction.model.js");
const mongoose = require("mongoose");
const redis_client = require("../db/redis_connect.js");

class PaymentController {
    async getExpireOrder(req, res) {
        try {
            const { sub } = req.userData;

            // Tìm giao dịch gần nhất của người dùng
            let transaction = await Transaction.findOne({ user_id: sub }).sort({ createdAt: -1 });

            if (!transaction) {
                return res.status(404).json({ message: "Không tìm thấy giao dịch nào!" });
            }

            const now = moment();
            const transactionTime = moment(transaction.createdAt);
            const duration = moment.duration(now.diff(transactionTime));
            const years = duration.asYears();

            if (years >= 1) {
                redis_client.set(`needpayment${sub}`, 1);
                return res.status(200).json({
                    yearsAgo: Math.floor(years),
                });
            } else {
                return res.status(200).json({
                    monthsAgo: Math.floor(duration.asMonths()),
                });
            }
        } catch (error) {}
    }
    async createOrder(req, res) {
        const { amount, currency } = req.body; // Lấy thông tin thanh toán từ request

        // Đo thời gian bắt đầu
        const startTime = performance.now();

        try {
            // Tạo đơn hàng trên PayPal
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE", // Ý định thanh toán (CAPTURE để thanh toán ngay)
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency || "USD", // Loại tiền (USD mặc định)
                            value: amount, // Số tiền
                        },
                    },
                ],
            });

            const order = await client.execute(request); // Gửi yêu cầu tới PayPal
            res.status(201).json({ id: order.result.id }); // Trả về ID của đơn hàng
        } catch (error) {
            console.error("Payment error:", error);

            // Gửi email thông báo lỗi
            try {
                await sendErrorEmails(
                    ["user@example.com", "admin@example.com"], // Người nhận
                    "Lỗi thanh toán PayPal", // Tiêu đề email
                    `Đã xảy ra lỗi khi thanh toán: ${error.message}` // Nội dung email
                );
            } catch (emailError) {
                console.error("Error sending email:", emailError);
            }

            // Đo thời gian kết thúc
            const endTime = performance.now();
            const timeTaken = endTime - startTime;

            console.log(`Time taken to send email: ${timeTaken}ms`);

            // Đảm bảo thời gian gửi email trong khoảng 30 giây
            if (timeTaken > 30000) {
                console.error("Email notification exceeded 30 seconds!");
            }

            res.status(500).send("Error creating PayPal order");
        }
    }

    async completeOrder(req, res) {
        const { orderId } = req.body; // Lấy order ID từ request
        const { sub } = req.userData; // Lấy user ID từ request

        try {
            // Xác nhận thanh toán trên PayPal
            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});

            const capture = await client.execute(request); // Gửi yêu cầu xác nhận tới PayPal

            // cập nhật lại redis
            redis_client.del(`needpayment${sub}`);

            res.status(200).json({
                success: true,
                data: capture.result, // Trả về kết quả thanh toán
            });
        } catch (error) {
            console.error("Capture error:", error);

            // Gửi email thông báo lỗi
            try {
                const user = await User.findById(req.userData?.sub);

                if (user.email)
                    await sendErrorEmails(
                        [user.email], // Người nhận
                        "Lỗi xác nhận thanh toán PayPal", // Tiêu đề email
                        `Đã xảy ra lỗi khi xác nhận thanh toán: ${error.message}` // Nội dung email
                    );
            } catch (emailError) {
                console.error("Error sending email:", emailError);
            }

            res.status(500).send("Error capturing PayPal order");
        }
    }
}

module.exports = new PaymentController();
