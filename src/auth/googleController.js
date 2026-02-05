import axios from "axios";
import prisma from "../prisma/prisma.js";
import { generateJWT } from "../utils/authUtils.js";

export class GoogleController {
  static redirect(req, res) {
    console.log("GoogleController.redirect called");

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
      console.error("Missing Google OAuth environment variables");
      return res.status(500).json({
        error: "Google OAuth environment variables not configured",
      });
    }

    console.log(
      `GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set"}`,
    );
    console.log(`GOOGLE_REDIRECT_URI: ${process.env.GOOGLE_REDIRECT_URI}`);

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log(`Redirecting to Google OAuth: ${authUrl}`);

    return res.redirect(authUrl);
  }

  static async callback(req, res) {
    console.log("Google OAuth - Callback received");

    try {
      const { code, error: googleError } = req.query;

      if (googleError) {
        console.error("Google OAuth - Error from Google:", googleError);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=google_oauth_error&message=${encodeURIComponent(googleError)}`,
        );
      }

      if (!code) {
        console.error("Google OAuth - No code received");
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=google_no_code`,
        );
      }

      console.log("Google OAuth - Received authorization code");

      const tokenParams = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });

      console.log("Google OAuth - Exchanging code for token...");

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
      console.log("Google OAuth - Access token received");

      console.log("Google OAuth - Fetching user profile...");
      const userRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const { sub: googleId, email, name, picture } = userRes.data;
      console.log("Google OAuth - User profile received:", { email, name });

      console.log("Google OAuth - Upserting user in database...");
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

      console.log("Google OAuth - User created/updated:", user.id);

      const jwtToken = generateJWT({ userId: user.id });
      console.log("Google OAuth - JWT token generated");

      const redirectUrl = `${process.env.FRONTEND_URL}/login/google-success?token=${jwtToken}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "")}`;
      console.log("Google OAuth - Redirecting to:", redirectUrl);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error(
        "Google OAuth callback error:",
        error.response?.data || error.message,
        error.stack,
      );

      let errorMessage = "google_auth_failed";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorMessage}`);
    }
  }
}
