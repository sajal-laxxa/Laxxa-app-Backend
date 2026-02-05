import nodemailer from "nodemailer";

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP Email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"LAXXA Fashion" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for LAXXA Login",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px;">LAXXA Fashion</h2>
          <p style="color: #666; margin-bottom: 30px;">Your one-stop fashion destination</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #333; margin-bottom: 15px;">Your OTP for login is:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; display: inline-block;">
            <h1 style="color: #ff6b6b; font-size: 36px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #666; font-size: 14px; margin-bottom: 5px;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} LAXXA Fashion. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send OTP email");
  }
}

export { sendOTPEmail };
