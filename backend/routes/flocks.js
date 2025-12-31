import express from "express";
import {
    getFlocks,
    getFlock,
    createFlock,
    updateFlock,
    deleteFlock,
    getFlockStats,
} from "../controllers/flockController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getFlocks).post(createFlock);
router.route("/stats").get(getFlockStats);
router.route("/:id").get(getFlock).put(updateFlock).delete(deleteFlock);

export default router;
