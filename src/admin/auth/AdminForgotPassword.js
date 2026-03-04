import prisma from "../../prisma/prisma.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const forgotPassword = async (email) => {
    if (!email) throw new Error("Email is required");

    // 🔎 Check if email exists
    const user = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() },
    });

    if (!user) {
        throw new Error("Email not registered");
    }

    // 🔐 Create reset token (15 min expiry)
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    const resetLink = `http://localhost:5051/admin/auth/reset-password/${resetToken}`;

    console.log(resetLink);

    // ✉ Send email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        html: `<p>Click below to reset password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
    });

    return { message: "Reset link sent to email" };
};
