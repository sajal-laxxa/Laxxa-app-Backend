import express from "express";
import { GoogleController } from "../auth/googleController.js";

const router = express.Router();

router.get("/login", GoogleController.redirect);
router.get("/callback", GoogleController.callback);

export default router;
