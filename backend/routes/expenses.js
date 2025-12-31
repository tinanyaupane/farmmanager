import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getExpenses,
    getExpenseStats,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getExpenses).post(createExpense);
router.get("/stats", getExpenseStats);
router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
