import express from "express";
import EmailController from "./emailController.js";

const router = express.Router();

// Send OTP to email
router.post("/send-otp", EmailController.sendOTP);

// Verify OTP
router.post("/verify-otp", EmailController.verifyOTP);

// Resend OTP
router.post("/resend-otp", EmailController.resendOTP);

export default router;
