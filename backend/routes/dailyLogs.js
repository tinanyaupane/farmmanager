import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getDailyLogs,
    getDailyLogStats,
    createDailyLog,
    updateDailyLog,
    deleteDailyLog,
} from "../controllers/dailyLogController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getDailyLogs).post(createDailyLog);
router.get("/stats", getDailyLogStats);
router.route("/:id").put(updateDailyLog).delete(deleteDailyLog);

export default router;
