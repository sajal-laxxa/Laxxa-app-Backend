const jwt = require("jsonwebtoken");
const otpStore = require("../stores/otp.store");
const { genOtp, hashOtp } = require("../utils/otp");

exports.sendOtp = async (phone) => {
    const otp = genOtp();

    otpStore.save(phone, hashOtp(otp));

    //  MOCK SMS (DEV MODE)
    //  verify phone number
    console.log(`\n[DEV OTP] Phone: ${phone} | OTP: ${otp}\n`);
};

exports.verifyOtp = (phone, otp) => {
    const data = otpStore.get(phone);

    if (!data) throw { statusCode: 400, publicMessage: "OTP not found" };
    if (Date.now() > data.expires)
        throw { statusCode: 400, publicMessage: "OTP expired" };

    if (hashOtp(otp) !== data.hash)
        throw { statusCode: 401, publicMessage: "Invalid OTP" };

    otpStore.remove(phone);

    return jwt.sign({ phone }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};
