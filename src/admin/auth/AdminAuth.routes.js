import express from "express";
import {
    Adminlogin,
    ForgotPasswordController,
    ResetPasswordController,
} from "./AdminAuth.controller.js";

const router = express.Router();

router.post("/login", Adminlogin);
router.post("/forgot-password", ForgotPasswordController);
router.post("/reset-password/:token", ResetPasswordController);

export default router;
