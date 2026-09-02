const { validationResult } = require("express-validator");
const userService = require("../services/user.service");


// =========================================
// UPDATE PASSWORD
// =========================================

const updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        await userService.updatePassword(
            req.user.id,
            req.body.password
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update password"
        });
    }
};


// =========================================
// CREATE USER - ADMIN
// =========================================

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, password and address are required"
            });
        }

        const user = await userService.createUser({
            name,
            email,
            password,
            address,
            role
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =========================================
// GET ALL USERS - ADMIN
// =========================================

const getAllUsers = async (req, res) => {
    try {

        const users =
            await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};


// =========================================
// ADMIN STATISTICS
// =========================================

const getAdminStats = async (req, res) => {
    try {

        const stats =
            await userService.getAdminStats();

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
};


module.exports = {
    updatePassword,
    createUser,
    getAllUsers,
    getAdminStats
};