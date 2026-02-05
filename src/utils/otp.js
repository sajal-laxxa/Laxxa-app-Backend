// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Calculate OTP expiry (10 minutes from now)
function getOTPExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000);
}

// Check if OTP is expired
function isOTPExpired(otpExpires) {
  return new Date() > new Date(otpExpires);
}

export { generateOTP, getOTPExpiry, isOTPExpired };
