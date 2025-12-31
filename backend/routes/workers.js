import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getWorkers,
    getWorkerStats,
    getWorker,
    createWorker,
    updateWorker,
    deleteWorker,
} from "../controllers/workerController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getWorkers).post(createWorker);
router.get("/stats", getWorkerStats);
router.route("/:id").get(getWorker).put(updateWorker).delete(deleteWorker);

export default router;
