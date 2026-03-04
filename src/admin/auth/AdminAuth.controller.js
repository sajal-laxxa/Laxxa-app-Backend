import { loginAdmin } from "./AdminAuth.service.js";
import { forgotPassword } from "./AdminForgotPassword.js";
import { resetPassword } from "./AdminResetpassword.js";

export const Adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginAdmin(email, password);

        res.json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

// ✅ FORGOT PASSWORD
export const ForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await forgotPassword(email);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ RESET PASSWORD
export const ResetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const result = await resetPassword(token, newPassword);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
