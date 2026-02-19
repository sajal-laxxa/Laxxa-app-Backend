const service = require("../services/mobile.auth.service");

exports.requestOtp = async (req, res, next) => {
    try {
        await service.sendOtp(req.body.phone);
        res.json({ message: "OTP sent" });
    } catch (e) {
        next(e);
    }
};

exports.verifyOtp = (req, res, next) => {
    try {
        const token = service.verifyOtp(req.body.phone, req.body.otp);
        res.json({ token });
    } catch (e) {
        next(e);
    }
};
