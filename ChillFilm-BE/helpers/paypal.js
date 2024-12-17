const paypal = require("@paypal/checkout-server-sdk");

// Cấu hình môi trường PayPal (sandbox)
const environment = new paypal.core.SandboxEnvironment(
    "AeGJbqVs1miWI1WwPivbfvAnDqGlwo1Txh1VZ5vOJOSu9PHwZwb5tIbNU22YihfBwSZ-cg6Q76HspIjG", // Thay bằng Client ID của bạn
    "EOntb7XVd2THrK2k3lRaBsFXBy75yCk5fqvhXVkv_Edo8krSbKFE9ETlJBZbWI2aqQKTlysvUC8j4T-N" // Thay bằng Secret Key của bạn
);
// Nếu sử dụng môi trường Live, thay bằng:
// const environment = new paypal.core.LiveEnvironment('YOUR_CLIENT_ID', 'YOUR_SECRET_KEY');

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;
