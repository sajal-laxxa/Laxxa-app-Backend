import prisma from "../../prisma/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new Error("Token and new password required");
    }

    // 🔐 Verify token
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // 🔎 Check user still exists
    const user = await prisma.admin.findUnique({
        where: { email: decoded.email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // 🔒 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log(user);

    // 🔄 Update password in Prisma DB
    await prisma.admin.update({
        where: { email: user.email },
        data: { password: hashedPassword },
    });

    return { message: "Password reset successful" };
};
