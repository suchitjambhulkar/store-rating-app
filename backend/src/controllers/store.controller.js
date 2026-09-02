const { validationResult } = require("express-validator");
const storeService = require("../services/store.service");

const getAllStores = async (req, res) => {
    try {
        const search = req.query.search || "";

        const stores = await storeService.getAllStores(
            req.user.id,
            search
        );

        res.status(200).json({
            success: true,
            data: stores
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch stores"
        });
    }
};


const createStore = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            address,
            ownerId
        } = req.body;

        const store = await storeService.createStore({
            name,
            email,
            address,
            ownerId
        });

        res.status(201).json({
            success: true,
            message: "Store created successfully",
            data: store
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const getAllStoresForAdmin = async (req, res) => {
    try {
        const stores =
            await storeService.getAllStoresForAdmin();

        res.status(200).json({
            success: true,
            data: stores
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch stores"
        });
    }
};


/* =========================================
   STORE OWNER DASHBOARD
========================================= */

const getOwnerDashboard = async (req, res) => {
    try {
        const result =
            await storeService.getOwnerDashboard(
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch owner dashboard"
        });
    }
};


module.exports = {
    getAllStores,
    createStore,
    getAllStoresForAdmin,
    getOwnerDashboard
};