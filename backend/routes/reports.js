import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getFinancialReport,
    getSalesTrends,
    getExpenseBreakdown,
    getFlockPerformance,
    getEggProductionReport,
    getMortalityReport,
    getDashboardAnalytics,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(protect);

router.get("/financial", getFinancialReport);
router.get("/sales-trends", getSalesTrends);
router.get("/expense-breakdown", getExpenseBreakdown);
router.get("/flock-performance", getFlockPerformance);
router.get("/egg-production", getEggProductionReport);
router.get("/mortality", getMortalityReport);
router.get("/dashboard-analytics", getDashboardAnalytics);

export default router;
