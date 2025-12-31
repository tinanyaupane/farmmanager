import Inventory from "../models/Inventory.js";

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
export const getInventoryItems = async (req, res, next) => {
    try {
        const { category, lowStock } = req.query;

        let query = { user: req.user.id };

        if (category) {
            query.category = category;
        }

        const items = await Inventory.find(query).sort("name");

        let data = items;
        if (lowStock === "true") {
            data = items.filter((item) => item.quantity <= item.minStock);
        }

        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
export const getInventoryItem = async (req, res, next) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
export const createInventoryItem = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const item = await Inventory.create(req.body);

        res.status(201).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
export const updateInventoryItem = async (req, res, next) => {
    try {
        let item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
export const deleteInventoryItem = async (req, res, next) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private
export const getInventoryStats = async (req, res, next) => {
    try {
        const items = await Inventory.find({ user: req.user.id });

        const lowStockItems = items.filter((item) => item.quantity <= item.minStock);

        const stats = {
            totalItems: items.length,
            lowStockItems: lowStockItems.length,
            byCategory: {
                feed: items.filter((i) => i.category === "feed").length,
                medicine: items.filter((i) => i.category === "medicine").length,
                equipment: items.filter((i) => i.category === "equipment").length,
                supplies: items.filter((i) => i.category === "supplies").length,
                other: items.filter((i) => i.category === "other").length,
            },
            totalValue: items.reduce(
                (acc, item) => acc + (item.pricePerUnit || 0) * item.quantity,
                0
            ),
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};
