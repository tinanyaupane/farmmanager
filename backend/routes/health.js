import express from "express";
import {
    getHealthEntries,
    getHealthEntry,
    createHealthEntry,
    updateHealthEntry,
    deleteHealthEntry,
    getHealthStats,
} from "../controllers/healthController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getHealthEntries).post(createHealthEntry);
router.route("/stats").get(getHealthStats);
router.route("/:id").get(getHealthEntry).put(updateHealthEntry).delete(deleteHealthEntry);

export default router;
