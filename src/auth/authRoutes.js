import express from "express";

import { authenticate } from "../middleware/auth.js";
import { logout } from "./authController.js";

const router = express.Router();

router.post("/logout", authenticate, logout);

export default router;

// import express from "express";
// import { logout } from "../auth/authController.js";

// const router = express.Router();

// router.post("/logout", logout);

// export default router;
