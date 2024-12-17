const client = require("../helpers/paypal.js");
const { performance } = require("perf_hooks");
const paypal = require("@paypal/checkout-server-sdk");
const sendErrorEmails = require("../helpers/nodemailer.js");

class PaymentController {
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

        try {
            // Xác nhận thanh toán trên PayPal
            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});

            const capture = await client.execute(request); // Gửi yêu cầu xác nhận tới PayPal
            res.status(200).json({
                success: true,
                data: capture.result, // Trả về kết quả thanh toán
            });
        } catch (error) {
            console.error("Capture error:", error);

            // Gửi email thông báo lỗi
            try {
                await sendErrorEmails(
                    ["user@example.com", "admin@example.com"], // Người nhận
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
