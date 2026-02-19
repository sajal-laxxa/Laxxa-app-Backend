const rateLimit = require("express-rate-limit");

const otpRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 3, // max 3 requests per window per IP
    standardHeaders: true, // return rate limit info in headers
    legacyHeaders: false,
    message: {
        error: "Too many OTP requests. Please try again later.",
    },
});

module.exports = { otpRateLimiter };
