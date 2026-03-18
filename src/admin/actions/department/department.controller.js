import {
    insertData,
    getData,
    editData,
    deleteData,
} from "../utils/crud.service.js";

// 1. Add Department
export const createDepartment = async (req, res) => {
    try {
        const data = await insertData("department", req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Departments (limit 5)
export const getDepartments = async (req, res) => {
    try {
        const { page = 1 } = req.query;

        const data = await getData("department", {
            page: Number(page),
            limit: 5,
            sortBy: "createdAt",
            order: "desc",
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Update Department
export const updateDepartment = async (req, res) => {
    try {
        const { code } = req.params;

        const data = await editData("department", "code", code, req.body);

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Delete Department
export const deleteDepartment = async (req, res) => {
    try {
        const { code } = req.params;

        await deleteData("department", "code", code);

        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
