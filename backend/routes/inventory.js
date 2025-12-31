import express from "express";
import {
    getInventoryItems,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryStats,
} from "../controllers/inventoryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getInventoryItems).post(createInventoryItem);
router.route("/stats").get(getInventoryStats);
router.route("/:id").get(getInventoryItem).put(updateInventoryItem).delete(deleteInventoryItem);

export default router;
