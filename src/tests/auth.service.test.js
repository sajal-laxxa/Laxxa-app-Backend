const authService = require("../services/auth.service");
const otpStore = require("../stores/otp.store");

// test data
const phone = "+919876543210";

(async () => {
    console.log("=== AUTH SERVICE TEST START ===");

    // 1️⃣ Request OTP
    await authService.sendOtp(phone);
    const stored = otpStore.get(phone);

    console.log("OTP stored:", !!stored);
    console.log("Expiry valid:", stored.expires > Date.now());

    // 2️⃣ Verify OTP (success)
    const otp = "1111";
    try {
        const token = authService.verifyOtp(phone, otp);
        console.log("JWT issued:", !!token);
    } catch (e) {
        console.error("Verification failed (unexpected):", e);
    }

    // 3️⃣ Verify OTP again (should fail – one time use)
    try {
        authService.verifyOtp(phone, otp);
        console.error("ERROR: OTP reused (this is bad)");
    } catch (e) {
        console.log("OTP reuse blocked ✔");
    }

    console.log("=== AUTH SERVICE TEST END ===");
})();
