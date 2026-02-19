const router = require("express").Router();
const c = require("./mobile.auth.controller");
const { otpRateLimiter } = require("../middlewares/rateLimit.middleware");

router.post("/request-otp", otpRateLimiter, c.requestOtp);
router.post("/verify-otp", c.verifyOtp);

module.exports = router;
