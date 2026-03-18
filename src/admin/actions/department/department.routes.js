import express from "express";
import {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment,
} from "./department.controller.js";

const router = express.Router();

// Add
router.post("/create", createDepartment);

// Get (with limit 5)
router.get("/getData", getDepartments);

// Update
router.put("/update/:code", updateDepartment);

// Delete
router.delete("/delete/:code", deleteDepartment);

export default router;
