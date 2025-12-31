import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getTasks,
    getTaskStats,
    getTodayTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.get("/stats", getTaskStats);
router.get("/today", getTodayTasks);
router.route("/:id").put(updateTask).delete(deleteTask);
router.put("/:id/complete", completeTask);

export default router;
