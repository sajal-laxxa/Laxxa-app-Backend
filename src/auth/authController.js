import { PrismaClient } from "@prisma/client";
import { hashToken } from "../utils/authUtils.js";

const prisma = new PrismaClient();

const logout = async (req, res) => {
  try {
    const { session_token } = req.cookies;

    if (session_token) {
      const hashedToken = hashToken(session_token);

      await prisma.session.deleteMany({
        where: {
          token: hashedToken,
        },
      });
    }

    res.clearCookie("auth_token");
    res.clearCookie("session_token");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Logout failed" });
  }
};

export { logout };
