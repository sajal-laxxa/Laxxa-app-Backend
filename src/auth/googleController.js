import axios from "axios";
import prisma from "../prisma/prisma.js";
import {
  generateJWT,
  generateSessionToken,
  hashToken,
} from "../utils/authUtils.js";

export class GoogleController {
  /**
   * STEP 1: Redirect user to Google
   * GET /api/auth/google/login
   */
  static redirect(req, res) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
      return res.status(500).json({
        error: "Google OAuth environment variables not configured",
      });
    }

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return res.redirect(authUrl);
  }

  /**
   * STEP 2: Google callback
   * GET /api/auth/google/callback
   */
  static async callback(req, res) {
    try {
      const { code } = req.query;
      if (!code) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=google_no_code`,
        );
      }

      /**
       * STEP 2.1: Exchange code for access token
       * IMPORTANT: must be x-www-form-urlencoded
       */
      const tokenParams = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        tokenParams.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token } = tokenRes.data;

      /**
       * STEP 2.2: Fetch Google user profile
       */
      const userRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const { sub: googleId, email, name, picture } = userRes.data;

      /**
       * STEP 2.3: Upsert user
       */
      const user = await prisma.user.upsert({
        where: { googleId },
        update: {
          email,
          name,
          profileImage: picture,
          isVerified: true,
        },
        create: {
          googleId,
          email,
          name,
          profileImage: picture,
          isVerified: true,
        },
      });

      /**
       * STEP 2.4: Create JWT + session
       */
      const jwtToken = generateJWT({ userId: user.id });
      const sessionToken = generateSessionToken();

      await prisma.session.create({
        data: {
          userId: user.id,
          token: hashToken(sessionToken),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          userAgent: req.get("User-Agent"),
          ipAddress: req.ip,
        },
      });

      /**
       * STEP 2.5: Set cookies & redirect to frontend
       */
      res
        .cookie("auth_token", jwtToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .cookie("session_token", sessionToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .redirect(process.env.FRONTEND_URL);
    } catch (error) {
      console.error(
        "Google OAuth callback error:",
        error.response?.data || error.message,
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
      );
    }
  }
}
