import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // 1️⃣ Find admin
    //
    const admin = await prisma.admin.findUnique({
        where: { email },
    });

    if (!admin) {
        throw new Error("Invalid credentials");
    }

    // 2️⃣ Compare password with hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
        {
            id: admin.id,
            role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

    // 4️⃣ Return safe data (never return password)
    return {
        token,
        admin: {
            id: admin.id,
            email: admin.email,
        },
    };
};
