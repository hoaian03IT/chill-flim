const nodemailer = require("nodemailer");

// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "stogether73@gmail.com", // Thay bằng email của bạn
        pass: "phaydplqueuwdayx", // Thay bằng mật khẩu ứng dụng
    },
});

// Hàm gửi email
const sendErrorEmails = async (recipients, subject, message) => {
    const mailOptions = {
        from: '"Your App" <your-email@gmail.com>', // Tên người gửi
        to: recipients.join(","), // Danh sách người nhận (ngăn cách bởi dấu phẩy)
        subject: subject, // Tiêu đề email
        text: message, // Nội dung email
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Ném lỗi để xử lý tiếp
    }
};

module.exports = sendErrorEmails;
