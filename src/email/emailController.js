import prisma from "../prisma/prisma.js";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";

class EmailController {
  // SEND OTP
  static async sendOTP(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    const otp = generateOTP();

    await prisma.verification.create({
      data: {
        userId: user.id,
        type: "email",
        code: otp,
        expiresAt: getOTPExpiry(),
      },
    });

    await sendOTPEmail(email, otp);

    return res.json({ success: true });
  }

  // VERIFY OTP → RETURN JWT
  static async verifyOTP(req, res) {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const record = await prisma.verification.findFirst({
      where: {
        userId: user.id,
        type: "email",
        code: otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await prisma.verification.delete({ where: { id: record.id } });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  // 🔁 RESEND OTP
  static async resendOTP(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old OTPs
    await prisma.verification.deleteMany({
      where: {
        userId: user.id,
        type: "email",
      },
    });

    const otp = generateOTP();

    await prisma.verification.create({
      data: {
        userId: user.id,
        type: "email",
        code: otp,
        expiresAt: getOTPExpiry(),
      },
    });

    await sendOTPEmail(email, otp);

    return res.json({ success: true, message: "OTP resent successfully" });
  }
}

export default EmailController;

// import prisma from "../prisma/prisma.js";
// import { generateOTP, getOTPExpiry } from "../utils/otp.js";
// import { sendOTPEmail } from "../utils/email.js";
// import {
//   generateJWT,
//   generateSessionToken,
//   hashToken,
// } from "../utils/authUtils.js";

// class EmailController {
//   // 1️⃣ Send OTP
//   static async sendOTP(req, res) {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: "Email required" });

//     let user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       user = await prisma.user.create({ data: { email } });
//     }

//     // Remove previous email OTPs
//     await prisma.verification.deleteMany({
//       where: { userId: user.id, type: "email" },
//     });

//     const otp = generateOTP();

//     await prisma.verification.create({
//       data: {
//         userId: user.id,
//         type: "email",
//         code: otp,
//         expiresAt: getOTPExpiry(),
//       },
//     });

//     await sendOTPEmail(email, otp);
//     res.json({ success: true });
//   }

//   // 2️⃣ Verify OTP
//   static async verifyOTP(req, res) {
//     const { email, otp } = req.body;

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const record = await prisma.verification.findFirst({
//       where: {
//         userId: user.id,
//         type: "email",
//         code: otp,
//         expiresAt: { gt: new Date() },
//       },
//     });

//     if (!record) {
//       return res.status(400).json({ error: "Invalid or expired OTP" });
//     }

//     await prisma.verification.delete({ where: { id: record.id } });

//     const token = generateJWT({
//       userId: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     return res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   }

//   // 3️⃣ Resend OTP  ✅ FIX ADDED
//   static async resendOTP(req, res) {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: "Email required" });

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Remove previous OTPs
//     await prisma.verification.deleteMany({
//       where: { userId: user.id, type: "email" },
//     });

//     const otp = generateOTP();

//     await prisma.verification.create({
//       data: {
//         userId: user.id,
//         type: "email",
//         code: otp,
//         expiresAt: getOTPExpiry(),
//       },
//     });

//     await sendOTPEmail(email, otp);
//     res.json({ success: true });
//   }
// }

// export default EmailController;
